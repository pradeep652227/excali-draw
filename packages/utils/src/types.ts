import { Request } from "express";
import WebSocket from "ws";

export interface AuthenticatedRequest extends Request {
    id?: string;
}

export interface AuthenticatedWebSocket extends WebSocket {
    id: string;
}

export interface RoomUser {
    ws: WebSocket;
    rooms: number[];//a user can join multiple rooms
    // userId: string;
}

export interface WebSocketResponse {
    status: boolean,
    type: string,
    data: any
}