'use client';
/*External Imports*/
import React, { useEffect, useRef } from "react";

import initDraw from "@/(utils)/canvas/initDraw";
import { useSocket } from "@/hooks";

export default function CanvasPage({ roomId }: { roomId: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { sendMessage, loading, socket } = useSocket({});

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        if (!socket) return;

        socket.onmessage = (message: MessageEvent<any>) => {
            const data = JSON.parse(message.data);
            const { type, status } = data;

            console.log('Message received from server:', data);

            if (type === 'join-room' && status === true) {
                initDraw(canvas, roomId, socket, sendMessage);
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

    return (
        <div id="canvas-container" className="w-screen h-screen">
            <canvas
                ref={canvasRef}
                id="canvas"
                className="w-full h-full"
            ></canvas>
        </div>
    );
}
