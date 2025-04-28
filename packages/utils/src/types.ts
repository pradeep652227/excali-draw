import { Request } from "express";
import WebSocket from "ws";

export interface AuthenticatedRequest extends Request {
    id?: string;
}

export interface AuthenticatedWebSocket extends WebSocket {
    id?: string;
}

export interface RoomUser {
    sockets: Set<AuthenticatedWebSocket>
    rooms: number[];//a user can join multiple rooms
    // userId: string;
}

export interface WebSocketResponse {
    status: boolean,
    type: string,
    data: any
}

export interface ApiResponse {
    status: boolean,
    message: string,
    data: any
}

export type Shape = {
    type: "rect",
    x: number,
    y: number,
    width: number,
    height: number,
} | {
    type: "circle",
    centreX: number,
    centreY: number,
    radius: number
} 