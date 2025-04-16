import WebSocket, { WebSocketServer } from 'ws';

import config from './config';
import { types } from '@repo/utils';
import { authMiddleware } from './middlewares';
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
        ws.close(4000, 'Authentication token not found');
        return;
    }

    const decodedInfo = await authMiddleware(token);
    if (!decodedInfo || !decodedInfo.id) {
        ws.close(4001, 'Invalid authentication token');
        return;
    }
    
    ws.id = decodedInfo.id; // Attach the user ID to the WebSocket instance
    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
        ws.send(`Echo: ${message}`);
    });
    ws.on('close', () => {
        console.log('Client disconnected');
    });
    ws.on('error', (error) => {
        console.error(`WebSocket error: ${error}`);
    });
})