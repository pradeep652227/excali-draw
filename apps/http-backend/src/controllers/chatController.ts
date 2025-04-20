import { Chat } from "@repo/database";
import { helpers, ZodSchemas, types } from "@repo/utils";
import { Request, Response } from "express";


export const getAllChatsOfARoom = async (req: Request, res: Response): Promise<any> => {
    try {
        const { roomId } = req.params as { roomId: string };
        if (!roomId)
            throw new helpers.CustomError(400, 'Required fields missing!!');
        let chats = await Chat.getChatsByRoomId(parseInt(roomId));

        return res.status(200).json(helpers.sendResponse(true, "Chats fetched successfully", { chats }));
    } catch (error: any) {
        if (!error.statusCode)
            console.error("Error in getAllChatsOfARoom function :", error);
        return res.status(500).json(helpers.sendResponse(false, error.statusCode != null ? error.message : "Internal server error"));
    }
}
