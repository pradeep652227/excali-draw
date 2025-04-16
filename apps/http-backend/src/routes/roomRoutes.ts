import * as roomController from "../controllers/roomController";
import { authentication as authMiddleware } from '../middlewares'
import { Router } from "express";

const router : any = Router();

router.use(authMiddleware);

router.post("/", roomController.createRoom);
router.get("/", roomController.getAllRooms);
router.get("/:id", roomController.getRoom);
router.delete("/:id", roomController.deleteRoom);