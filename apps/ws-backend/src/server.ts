import { WebSocketServer } from 'ws';

import config from './config';
import { types, helpers, ZodSchemas } from '@repo/utils';
import { authMiddleware } from './middlewares';
import { Users_RoomsInfo } from './constants';
import MainSocket from './socket/main';

const wss = new WebSocketServer({ port: config.port });

console.log(`WebSocket server listening on port ${process.env.PORT}`);

wss.on('connection', async (ws: types.AuthenticatedWebSocket, request) => {
    console.log('(((())))))) Client connected (((((((()))))) ');
    /* Validate this websocket instance for authentication*/
    const url = request.url;
    if (!url)
        return;
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token: string | null = queryParams.get('token');
    if (!token) {
        console.log('(((())))))) Client disconnected : token not present (((((((()))))) ');
        ws.close(4000, 'Authentication token not found');
        return;
    }

    const userId = await authMiddleware(token);

    if (!userId) {
        console.log('(((())))))) Client disconnected : Invalid Token (((((((()))))) ');
        ws.close(4001, 'Invalid authentication token');
        return;
    }

    ws.id = userId; // Attach the user ID to the WebSocket instance
    //now set the user info in the map
    const existing = Users_RoomsInfo.get(ws.id);
    if (existing) {
        console.log(`🔁 Duplicate connection for ${ws.id}. Closing previous one.`);
        return existing.ws.close(4002, 'Duplicate connection');
    }
    Users_RoomsInfo.set(ws.id, { ws, rooms: [] });

    ws.on('message', (data) => {
        try {
            const raw = Buffer.isBuffer(data) ? data.toString('utf8') : data;
            console.log(`📩 Received raw data:`, raw);

            if (typeof raw !== 'string') {
                ws.send(JSON.stringify(helpers.sendWebSocketResponse(false, 'error', { message: 'Invalid data type' })));
                return;
            }

            const parsedData = JSON.parse(raw);
            const { success, data: messageData, error } = ZodSchemas.MessageSchema.safeParse(parsedData);

            if (!success) {
                const errorMessages = error.errors.map((err: any) => err.message).join(' | ');
                throw new helpers.CustomError(400, errorMessages || 'Invalid message format');
            }

            return MainSocket(messageData, ws);
        } catch (error: any) {
            if (!error.statusCode) console.error('❌ Error parsing message:', error);
            ws.send(JSON.stringify(helpers.sendWebSocketResponse(false, 'error', {
                message: error.statusCode != null ? error.message : 'Error parsing message'
            })));
        }
    });

    ws.on('close', (code, reason) => {
        console.log(`📴 Client disconnected. Code: ${code}, Reason: ${reason}`);
        if (Users_RoomsInfo.has(ws.id)) {
            Users_RoomsInfo.delete(ws.id);
            console.log(`✅ Removed user ${ws.id}. Users_RoomsInfo size: ${Users_RoomsInfo.size}`);
        } else {
            console.log(`ℹ️ User ${ws.id} already removed or never added`);
        }
    });

    ws.on('error', (error) => {
        console.error(`⚠️ WebSocket error for user ${ws.id}:`, error);
        if (Users_RoomsInfo.has(ws.id)) {
            Users_RoomsInfo.delete(ws.id);
            console.log(`🧹 Cleaned up user ${ws.id} after error`);
        }
    });

})