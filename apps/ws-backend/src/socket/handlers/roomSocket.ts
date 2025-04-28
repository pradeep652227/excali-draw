import { helpers, types } from "@repo/utils";
import { Users_RoomsInfo } from '../../constants';
import { Room, Chat } from '@repo/database';

export const joinRoom = async (ws: types.AuthenticatedWebSocket, data: any) => {
    try {
        console.log('(((((( joinRoom function ))))))');
        const userId = ws.id;
        if (!userId)
            throw new helpers.CustomError(400, 'User is missing to send the message');

        const { roomId } = data;
        if (!roomId)
            throw new helpers.CustomError(400, 'RoomId is required');

        const existingUser_RoomsInfo = Users_RoomsInfo.get(userId)
        if (!existingUser_RoomsInfo)
            throw new helpers.CustomError(400, 'User socket data is not present!!');

        //first check if there is a room of this id in the database
        const room = await Room.findById(roomId);
        if (!room)
            throw new helpers.CustomError(400, 'No Such Room Exists!!');

        const isUserAlreadyJoinedRoom = existingUser_RoomsInfo.rooms.find(id => id == roomId);
        if (!isUserAlreadyJoinedRoom)
            Users_RoomsInfo.set(userId, {
                ...existingUser_RoomsInfo,
                rooms: [...existingUser_RoomsInfo.rooms, roomId]
            });

        console.log('Sending join Room response :- ');
        return ws.send(JSON.stringify(helpers.sendWebSocketResponse(true, 'join-room')));
    } catch (error: any) {
        if (error.statusCode) {
            console.log('sending False join-room event because :- ', error.message);
            return ws.send(JSON.stringify(helpers.sendWebSocketResponse(false, 'join-room', { message: error.message })));
        }

        console.error('Error in joinRoom socket function ', error);
        return ws.send(JSON.stringify(helpers.sendWebSocketResponse(false, error.statusCode != null ? error.message : 'Internal Server Error')));
    }
}

export const leaveRoom = async (userId: string, data: any) => {
    try {
        const { roomId } = data;
        if (!roomId)
            throw new helpers.CustomError(400, 'RoomId is required');

        const existingUser_RoomsInfo = Users_RoomsInfo.get(userId)
        if (!existingUser_RoomsInfo)
            throw new helpers.CustomError(400, 'User socket data is not present!!');

        Users_RoomsInfo.set(userId, {
            ...existingUser_RoomsInfo,
            rooms: existingUser_RoomsInfo.rooms.filter(id => id != roomId)
        });

        return helpers.sendWebSocketResponse();
    } catch (error: any) {
        if (!error.statusCode)
            console.error('Error in leaveRoom socket function ', error);
        return helpers.sendWebSocketResponse(false, error.statusCode != null ? error.message : 'Internal Server Error');
    }
}

export const sendMessage = async (ws: types.AuthenticatedWebSocket, data: any) => {
    try {
        const { roomId, message } = data;
        const userId = ws.id;
        if (!userId)
            throw new helpers.CustomError(400, 'User is missing to send the message');


        if (typeof roomId !== 'number' || typeof message !== 'string' || message.trim() === '') {
            throw new helpers.CustomError(400, 'roomId must be a number and message must be a non-empty string');
        }

        // Broadcast to all sockets of users in the room
        let idx = 0;
        for (const user of Users_RoomsInfo.values()) {
            const isUserSubscribed = user.rooms.includes(roomId);

            console.log('isUserSubscribed :- ', isUserSubscribed);
            if (isUserSubscribed) {
                for (const socket of user.sockets) {
                    socket.send(JSON.stringify({
                        status: true,
                        type: "message",
                        data: { roomId, message, createdAt: new Date().getTime(), id: idx++ },
                    } as types.WebSocketResponse));
                }
            }
        }

        // Save the message to DB
        const chat = await Chat.create({
            message,
            userId,
            roomId
        });
        if (!chat)
            throw new helpers.CustomError(500, 'Chat cannot be created for this message');
    } catch (error: any) {
        if (!error.statusCode)
            console.error('❌ Error in sendMessage:', error);

        ws.send(JSON.stringify({
            status: false,
            type: "message",
            data: {
                message: error.statusCode != null ? error.message : 'Internal Server Error'
            }
        } as types.WebSocketResponse));
    }
};

