'use client';
/*External Imports*/
import React, { useEffect, useRef, useState } from "react";

import initDraw from "@/(utils)/canvas/initDraw";
import { useSocket } from "@/hooks";

export default function CanvasPage({ roomId }: { roomId: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { sendMessage, loading, socket } = useSocket({});
    const [selectedTool, setSelectedTool] = useState<'line' | 'circle' | 'rect'>('line');
    const [isJoinRoom, setIsJoinRoom] = useState(false);

    useEffect(() => {
        if (!socket) return;

        socket.onmessage = (message: MessageEvent<any>) => {
            const data = JSON.parse(message.data);
            const { type, status } = data;

            console.log('Message received from server:', data);

            if (type === 'join-room' && status === true) {
                console.log('Successfully joined room:', roomId);
                setIsJoinRoom(true);
            }
        };

        if (socket.readyState === WebSocket.OPEN) {
            console.log('Socket already open. Sending join-room');
            sendMessage({
                type: 'join-room',
                data: {
                    roomId: parseInt(roomId.trim()),
                    message: 'Hi there 👋',
                },
            });
        } else {
            console.log('Socket not open yet. Waiting...');
            socket.onopen = () => {
                console.log('Socket opened. Sending join-room');
                sendMessage({
                    type: 'join-room',
                    data: {
                        roomId: parseInt(roomId.trim()),
                        message: 'Hi there 👋',
                    },
                });
            };
        }

    }, [canvasRef, socket, sendMessage, roomId]);

    useEffect(() => {
        if (!isJoinRoom) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        initDraw(canvas, roomId, socket, sendMessage, selectedTool);
    }, [isJoinRoom, selectedTool]);

    return (
        <div id="canvas-container" className="w-screen h-screen">
            <canvas
                ref={canvasRef}
                id="canvas"
                className="w-full h-full"
            ></canvas>
            {/* Toolbar */}
            <div className="absolute top-4 left-4 flex gap-2 bg-white p-2 rounded shadow">
                <button
                    onClick={() => setSelectedTool('line')}
                    className={`px-4 py-2 rounded ${selectedTool === 'line' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Line
                </button>
                <button
                    onClick={() => setSelectedTool('circle')}
                    className={`px-4 py-2 rounded ${selectedTool === 'circle' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Circle
                </button>
                <button
                    onClick={() => setSelectedTool('rect')}
                    className={`px-4 py-2 rounded ${selectedTool === 'rect' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Rectangle
                </button>
            </div>
        </div>
    );
}
