import { Room as PrismaRoom, Chat as PrismaChat } from "@prisma/client";
import { prisma } from "../connection.js";

export default class Room {
    admin?: PrismaRoom;
    chats?: PrismaChat[];
    constructor(data: PrismaRoom) {
        Object.assign(this, data);
    }
    /*Static Methods*/
    static async create(data: { slug: string, adminId: string }): Promise<Room | null> {
        const room = await prisma.room.create({ data });
        return room ? new Room(room) : null;
    }
    static async findById(id: number): Promise<Room | null> {
        const room = await prisma.room.findUnique({ where: { id } });

        return room ? new Room(room) : null;
    }

    static async findBySlug(slug: string): Promise<Room | null> {
        try {
            const room = await prisma.room.findUnique({ where: { slug } });
            return room ? new Room(room) : null;
        } catch (error) {
            return null;
        }
    }
    static async getRoomsByAdminId(adminId: string): Promise<PrismaRoom[]> {
        return await prisma.room.findMany({ where: { adminId } });
    }

    static async getAll(): Promise<PrismaRoom[]> {
        return await prisma.room.findMany();
    }
    static async delete(id: number): Promise<Boolean | null> {
        const room = await prisma.room.delete({ where: { id } });
        if (room)
            return true;
        return false;
    }


    /*Methods*/
    getAdminDetails() {
        return this.admin
    }

    getAllChats() {
        return this.chats;
    }
}
