import { useEffect, useRef, useState, useCallback } from "react";
import { wsBaseUrl } from '@/(utils)/config';

export default function useSocket({
    onMessage,
    onOpen,
    onClose,
    onError
}: {
    onMessage?: (message: MessageEvent<any>) => void;
    onOpen?: () => void;
    onClose?: () => void;
    onError?: (event: Event) => void
}) {
    const socketRef = useRef<WebSocket | null>(null);
    const [readyState, setReadyState] = useState<WebSocket["readyState"]>(WebSocket.CLOSED);

    useEffect(() => {
        const socket = new WebSocket(`${wsBaseUrl}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZmZjQzYTc5LWJlMDAtNDFjYi04YTkzLWYwYzczZTRmMjk2NCIsImlhdCI6MTc0NTg1MjY2OCwiZXhwIjoxNzQ1ODU2MjY4LCJhdWQiOiJkcmF3LWFwcC1mcm9udGVuZCIsImlzcyI6ImRyYXctYXBwLWJhY2tlbmQiLCJzdWIiOiJBdXRoZW50aWNhdGlvbiIsImp0aSI6IjY3N2ZkZmJlLTEyNTMtNDVjYi04YzhkLTFlMGZiN2JiOTBmNSJ9.YniVpQxVfWuKXZQEI53UkkA_v4ulBlM6SRAfI_D6zJk`);
                socketRef.current = socket;

        setReadyState(WebSocket.CONNECTING);

        socket.onopen = () => {
            setReadyState(WebSocket.OPEN);
            console.log("WebSocket connection opened. and socket  = ", socket);
            if (onOpen) onOpen();
        };

        if (onMessage)
            socket.onmessage = onMessage;

        socket.onerror = (err) => {
            console.error("WebSocket error:", err);
            onError?.(err);
        };

        socket.onclose = () => {
            setReadyState(WebSocket.CLOSED);
            console.log("WebSocket connection closed.");
            onClose?.();
        };

        return () => {
            socket.close();
            console.log("WebSocket connection closed on cleanup.");
        }
    }, [onMessage, onOpen, onClose, onError]);

    const sendMessage = useCallback((data: string | object) => {
        console.log("sending message", data);
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            const payload = typeof data === "string" ? data : JSON.stringify(data);
            console.log('Sending message:', payload);
            socketRef.current.send(payload);
        } else {
            console.warn("Socket not open. Cannot send message.");
        }
    }, []);

    return {
        sendMessage,
        loading: readyState === WebSocket.OPEN,
        readyState,
        socket: socketRef.current,
    }
}