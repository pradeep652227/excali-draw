'use client';
/*External Imports*/
import React, { useEffect, useState, useCallback, useRef, useId } from "react";
import axios from "axios";

/*Internal Imports*/
import { Input, Button } from "@/components";
import { apiBaseUrl } from "@/(utils)/config";
import { useSocket } from "@/hooks";
type Chat = {
    id: string;
    message: string;
    sender: string;
    timestamp: string;
};

export default function JoinRoomClient({ roomId }: { roomId: string }) {
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState(true);
    const inputTextRef = useRef<HTMLInputElement>(null);

    const onMessage = useCallback((message: MessageEvent<any>) => {
        try {
            const data = JSON.parse(message.data);
            console.log('📩 Received message:', data);
            if (data?.type === 'message' && data?.status && data?.data) {
                setChats((prevChats) => [...prevChats, { ...data.data, id: new Date().getTime() }]);
            }
        } catch (err) {
            console.error('Failed to parse message:', err);
        }
    }, []);

    const { sendMessage, loading: socketLoading, socket, readyState } = useSocket({ onMessage });

    useEffect(() => {
        console.log('1st useEffect');
        if (readyState === WebSocket.OPEN) {
            sendMessage({
                type: 'join-room',
                data: {
                    roomId: parseInt(roomId),
                    message: 'Hi there 👋',
                },
            });
        }
    }, [readyState, roomId, sendMessage]);

    useEffect(() => {
        console.log('2nd useEffect');
        const fetchChats = async () => {
            try {
                const response = await axios.get(`${apiBaseUrl}/api/v1/chat/all-${roomId}`);
                const data = response.data;

                console.log(`🚀 ~ JoinRoomClient.tsx:54 ~ fetchChats ~ data:`, data)

                if (data.status == 1) {
                    // setChats(data.data.chats);
                }
            } catch (error) {
                console.error('Failed to fetch chats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, [roomId]);

    const handleSendMessage = useCallback(() => {
        const message = inputTextRef.current?.value;
        if (message?.trim()) {
            sendMessage({
                type: 'message',
                data: {
                    roomId: parseInt(roomId),
                    message,
                },
            });
            if (inputTextRef?.current?.value)
                inputTextRef.current.value = '';
        }
    }, [roomId, sendMessage]);

    return (
        <div>
            <h1 className="text-3xl text-center mt-4">Joined Room: {roomId}</h1>
            <div className="flex flex-col gap-4 justify-center items-center h-screen">
                {loading ? (
                    <p className="text-gray-500">Loading chats...</p>
                ) : chats.length === 0 ? (
                    <p className="text-gray-400">No chats yet.</p>
                ) : (
                    <ul className="w-full max-w-md p-4 border rounded shadow-md overflow-y-auto max-h-[400px]">
                        {chats.map((chat) => (
                            <li key={chat.id} className="mb-2 border-b pb-2 last:border-none">
                                <p className="font-semibold">{chat.sender}</p>
                                <p>{chat.message}</p>
                                <p className="text-xs text-gray-500">
                                    {new Date(new Date(chat.createdAt)).toLocaleString('en-IN', {
                                        timeZone: 'Asia/Kolkata',
                                    })}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="flex gap-1">
                    <Input
                        placeholder="Type your message..."
                        className="px-1"
                        ref={inputTextRef}
                    />
                    <Button
                        label="Enter"
                        className="bg-gray-900 text-white hover:text-gray-900 hover:bg-gray-200 duration-200"
                        onClick={handleSendMessage}
                    />
                </div>
            </div>
        </div>
    );
}