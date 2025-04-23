import * as chatController from "../controllers/chatController";
import { authentication as authMiddleware } from '../middlewares'
import { Router } from "express";

const router : any = Router();

// router.use(authMiddleware);

router.get("/all-:roomId", chatController.getAllChatsOfARoom);

export default router;