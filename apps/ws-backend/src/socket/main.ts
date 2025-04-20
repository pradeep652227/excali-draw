
import { helpers, ZodSchemas, types } from "@repo/utils";
import { joinRoom, leaveRoom, sendMessage } from './handlers';
export default async function Main(data: ZodSchemas.IncomingMessage, ws: types.AuthenticatedWebSocket) {
    try {
        const { type, data: messageData } = data;
        if (type === 'join-room') {
            const res: types.WebSocketResponse = await joinRoom(ws.id, messageData);

            console.log(`🚀 ~ main.ts:10 ~ Main ~ res:`, res)

            if (ws.readyState === ws.OPEN) {
                ws.send(JSON.stringify(res));
            } else {
                console.error('WebSocket is not open!');
            }
            return;
        }

        if (type === 'leave-room') {
            const res: types.WebSocketResponse = await leaveRoom(ws.id, messageData);
            return ws.send(JSON.stringify(res));
        }

        if (type === 'message') {
            return await sendMessage(ws, messageData);
        }

    } catch (error: any) {
        if (!error.statusCode) {
            console.error('Error in MainSocket:', error);
        }
        return ws.send(JSON.stringify({ status: false, type: 'error', data: { message: error.statusCode != null ? error.message : 'Internal Server Error' } } as types.WebSocketResponse));
    }
}
