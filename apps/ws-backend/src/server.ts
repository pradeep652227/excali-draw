import WebSocket, { WebSocketServer } from 'ws';

import config from './config';
const wss = new WebSocketServer({ port: config.port });

console.log(`WebSocket server listening on port ${process.env.PORT}`);

wss.on('connection', (ws) => {
    console.log('Client connected');
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