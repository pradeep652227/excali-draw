import { Shape as PrismaShape, User as PrismaUser, Room as PrismaRoom } from "@prisma/client";
import { prisma } from "../connection.js";
import { ZodSchemas } from "@repo/utils";

export default class Shape {
    User?: PrismaUser;
    Canvas?: PrismaRoom;
    constructor(data: PrismaShape) {
        Object.assign(this, data);
    }
    /*Static Methods*/
    static async create(data: ZodSchemas.CreateShapeType): Promise<Shape | null> {
        const shape = await prisma.shape.create({ data });
        return shape ? new Shape(shape) : null;
    }
    static async findById(id: number): Promise<Shape | null> {
        const shape = await prisma.shape.findUnique({ where: { id } });

        return shape ? new Shape(shape) : null;
    }

    static async findByUser(userId: string): Promise<PrismaShape[] | null> {
        try {
            const chats = await prisma.shape.findMany({ where: { userId } });
            return chats;
        } catch (error) {
            return null;
        }
    }
    static async getShapesByCanvasId(canvasId: number, limit = 50): Promise<PrismaShape[]> {
        return await prisma.shape.findMany({ where: { canvasId }, orderBy : {id : "desc"}, take : limit });
    }

    static async getAll(): Promise<PrismaShape[]> {
        return await prisma.shape.findMany();
    }
    static async delete(id: number): Promise<Boolean | null> {
        const shape = await prisma.shape.delete({ where: { id } });
        if (shape)
            return true;
        return false;
    }


    /*Methods*/
    getUserDetails() {
        return this.User;
    }

    getCanvasDetails() {
        return this.Canvas;
    }
}
