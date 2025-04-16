import { User } from "@repo/database";
import { Request } from "express";
import WebSocket from "ws";

export interface AuthenticatedRequest extends Request {
    user?: User;
    id?: string;
}

export interface AuthenticatedWebSocket extends WebSocket {
    id: string;
}