'use client';
/*External Imports*/
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

/*Internal Imports*/
import { Input } from "@/components";
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

    const onMessage = useCallback((message: MessageEvent<any>) => {
        console.log(`🚀 ~ JoinRoomClient.tsx:20 ~ onMessage ~ message:`, message);
    }, []);

    const { sendMessage, loading: socketLoading, socket } = useSocket({ onMessage });

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await axios.get(`${apiBaseUrl}/api/v1/chat/all-${roomId}`);
                console.log(`🚀 ~ JoinRoomClient.tsx:25 ~ fetchChats ~ response:`, response)
                const data = response.data;
                if (data.status == 1) {
                    setChats(data.data.chats);
                }
            } catch (error) {
                console.error("Failed to fetch chats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, [roomId]);

    return (
        <div>
            <h1 className="text-3xl text-center mt-4">Joined Room: {roomId}</h1>
            <div className="flex flex-col gap-4 justify-center items-center h-screen">
                {loading ? (
                    <p className="text-gray-500">Loading chats...</p>
                ) : chats.length === 0 ? (
                    <p className="text-gray-400">No chats yet.</p>
                ) : (
                    <ul className="w-full max-w-md p-4 border rounded shadow-md">
                        {chats.map((chat) => (
                            <li key={chat.id} className="mb-2 border-b pb-2 last:border-none">
                                <p className="font-semibold">{chat.sender}</p>
                                <p>{chat.message}</p>
                                <p className="text-xs text-gray-500">
                                    {new Date(chat.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
                <Input placeholder="Type your message..." />
            </div>
        </div>
    );

}
