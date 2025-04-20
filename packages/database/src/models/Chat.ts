import { Chat as PrismaChat, User as PrismaUser, Room as PrismaRoom } from "@prisma/client";
import { prisma } from "../connection.js";
import { ZodSchemas } from "@repo/utils";
export default class Chat {
    User?: PrismaUser;
    Room?: PrismaRoom;
    constructor(data: PrismaChat) {
        Object.assign(this, data);
    }
    /*Static Methods*/
    static async create(data: ZodSchemas.CreateChatType): Promise<Chat | null> {
        const chat = await prisma.chat.create({ data });
        return chat ? new Chat(chat) : null;
    }
    static async findById(id: number): Promise<Chat | null> {
        const chat = await prisma.chat.findUnique({ where: { id } });

        return chat ? new Chat(chat) : null;
    }

    static async findByUser(userId: string): Promise<PrismaChat[] | null> {
        try {
            const chats = await prisma.chat.findMany({ where: { userId } });
            return chats;
        } catch (error) {
            return null;
        }
    }
    static async getChatsByRoomId(roomId: number): Promise<PrismaChat[]> {
        return await prisma.chat.findMany({ where: { roomId } });
    }

    static async getAll(): Promise<PrismaChat[]> {
        return await prisma.chat.findMany();
    }
    static async delete(id: number): Promise<Boolean | null> {
        const chat = await prisma.chat.delete({ where: { id } });
        if (chat)
            return true;
        return false;
    }


    /*Methods*/
    getUserDetails() {
        return this.User;
    }

    getRoomDetails() {
        return this.Room;
    }
}
