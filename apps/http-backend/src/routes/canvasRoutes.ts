import * as canvasController from "../controllers/canvasController";
import { authentication as authMiddleware } from '../middlewares'
import { Router } from "express";

const router : any = Router();

// router.use(authMiddleware);

router.get("/all-:canvasId", canvasController.getAllShapesOfCanvas);

export default router;