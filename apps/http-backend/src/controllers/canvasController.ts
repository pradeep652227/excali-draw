import { Shape } from "@repo/database";
import { helpers, ZodSchemas, types } from "@repo/utils";
import { Request, Response } from "express";


export const getAllShapesOfCanvas = async (req: Request, res: Response): Promise<any> => {
    try {
        const { canvasId } = req.params as { canvasId: string };
        if (!canvasId)
            throw new helpers.CustomError(400, 'Required fields missing!!');
        let shapes = await Shape.getShapesByCanvasId(parseInt(canvasId));

        return res.status(200).json(helpers.sendResponse(true, "Shapes fetched successfully", { shapes }));
    } catch (error: any) {
        if (!error.statusCode)
            console.error("Error in getAllShapesOfCanvas function :", error);
        return res.status(500).json(helpers.sendResponse(false, error.statusCode != null ? error.message : "Internal server error"));
    }
}
