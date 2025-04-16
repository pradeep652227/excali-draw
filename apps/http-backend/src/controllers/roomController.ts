import { Room } from "@repo/database";
import { helpers, ZodSchemas, types } from "@repo/utils";
import { Request, Response } from "express";
export const createRoom = async (req: types.AuthenticatedRequest, res: any): Promise<any> => {
    try {
        req.body.adminId = req.id;
        const { success, data, error } = ZodSchemas.CreateRoomSchema.safeParse(req.body);
        if (!success)
            throw new helpers.CustomError(400, error?.issues[0]?.message || "Invalid request body");

        const room = await Room.create(data);

        return res.status(201).json(helpers.sendResponse(true, "Room created successfully", { room }));
    } catch (error: any) {
        if (!error.statusCode)
            console.error("Error creating room:", error);
        return res.status(500).json(helpers.sendResponse(false, error.statusCode != null ? error.message : "Internal server error"));
    }
}

export const getAllRooms = async (req: Request, res: Response): Promise<any> => {
    try {
        const { adminId } = req.query as { adminId: string };
        let rooms;
        if (adminId) {
            rooms = await Room.getRoomsByAdminId(adminId);
        } else
            rooms = await Room.getAll();

        return res.status(200).json(helpers.sendResponse(true, "Rooms fetched successfully", { rooms }));
    } catch (error: any) {
        if (!error.statusCode)
            console.error("Error fetching rooms:", error);
        return res.status(500).json(helpers.sendResponse(false, error.statusCode != null ? error.message : "Internal server error"));
    }
}

export const getRoom = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params as { id: string };
        const room = await Room.findById(Number(id));
        if (!room)
            throw new helpers.CustomError(404, "Room not found");

        return res.status(200).json(helpers.sendResponse(true, "Room fetched successfully", { room }));
    }
    catch (error: any) {
        if (!error.statusCode)
            console.error("Error fetching rooms:", error);
        return res.status(500).json(helpers.sendResponse(false, error.statusCode != null ? error.message : "Internal server error"));
    }
}

export const deleteRoom = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params as { id: string };
        const room = await Room.delete(Number(id));
        if (!room)
            throw new helpers.CustomError(404, "Room not found");

        return res.status(200).json(helpers.sendResponse(true, "Room deleted successfully", { room }));
    } catch (error: any) {
        if (!error.statusCode)
            console.error("Error deleting room:", error);
        return res.status(500).json(helpers.sendResponse(false, error.statusCode != null ? error.message : "Internal server error"));
    }
}
