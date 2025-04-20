import z from 'zod';

export const CreateRoomSchema = z.object({
    slug: z.string().min(3).max(20),
    adminId: z.string()
});
export type RoomSchema = z.infer<typeof CreateRoomSchema>;

export const MessageSchema = z.object({
    type : z.string(),
    data : z.any().optional()
});
export type IncomingMessage = z.infer<typeof MessageSchema>;

export const CreateChatSchema = z.object({
    userId : z.string(),
    message : z.string(),
    roomId : z.number()
});
export type CreateChatType = z.infer<typeof CreateChatSchema>;