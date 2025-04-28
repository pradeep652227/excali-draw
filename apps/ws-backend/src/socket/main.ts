
import { helpers, ZodSchemas, types } from "@repo/utils";
import { joinRoom, leaveRoom, sendMessage, sendShape } from './handlers';
export default async function Main(data: ZodSchemas.IncomingMessage, ws: types.AuthenticatedWebSocket) {
    try {
        const userId = ws.id;
        if(!userId)
            throw new helpers.CustomError(400, 'User is missing to send the message');
        const { type, data: messageData } = data;
        if (type === 'join-room') {
            console.log('((((((( type == join-room main.ts');
            return await joinRoom(ws, messageData);
        }

        if (type === 'leave-room') {
            const res: types.WebSocketResponse = await leaveRoom(userId, messageData);
            return ws.send(JSON.stringify(res));
        }

        if (type === 'message') {
            return await sendMessage(ws, messageData);
        }

        /*Shape*/
        if (type == 'shape') {
            return await sendShape(ws, messageData);
        }

    } catch (error: any) {
        if (!error.statusCode) {
            console.error('Error in MainSocket:', error);
        }
        return ws.send(JSON.stringify({ status: false, type: 'error', data: { message: error.statusCode != null ? error.message : 'Internal Server Error' } } as types.WebSocketResponse));
    }
}
