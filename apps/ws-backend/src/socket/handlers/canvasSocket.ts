import { helpers, types } from "@repo/utils";
import { Users_RoomsInfo } from '../../constants';
import { Room as Canvas, Shape } from '@repo/database';

export const sendShape = async (ws: types.AuthenticatedWebSocket, data: any) => {
    try {
        const userId = ws.id;
        if (!userId)
            throw new helpers.CustomError(400, 'User is missing to send the message');

        const { type, roomId, dimensions } = data;

        console.log(`🚀 ~ sendShape ~ data:`, data);

        if (!type || !roomId || !dimensions)
            throw new helpers.CustomError(400, 'Shape type, roomId and dimensions are required!!');

        if (typeof roomId !== 'number' || typeof dimensions !== 'string' || dimensions.trim() === '') {
            throw new helpers.CustomError(400, 'roomId must be a number and dimensions must be a non-empty string');
        }

        // Save the shape into DB
        const shape = await Shape.create({
            type,
            dimensions,
            userId,
            canvasId: roomId
        });
        if (!shape)
            throw new helpers.CustomError(500, 'Shape cannot be created');

        // Broadcast to all sockets of users in the room
        for (const user of Users_RoomsInfo.values()) {
            const isUserSubscribed = user.rooms.includes(roomId);

            console.log('isUserSubscribed :- ', isUserSubscribed);
            if (isUserSubscribed) {
                for (const socket of user.sockets) {
                    socket.send(JSON.stringify({
                        status: true,
                        type: "shape",
                        data: { 
                            type, 
                            roomId, 
                            dimensions, 
                            createdAt: new Date().getTime() 
                        },
                    } as types.WebSocketResponse));
                }
            }
        }

    } catch (error: any) {
        if (!error.statusCode)
            console.error('❌ Error in sendShape:', error);

        ws.send(JSON.stringify({
            status: false,
            type: "shape",
            data: {
                message: error.statusCode != null ? error.message : 'Internal Server Error'
            }
        } as types.WebSocketResponse));
    }
};
