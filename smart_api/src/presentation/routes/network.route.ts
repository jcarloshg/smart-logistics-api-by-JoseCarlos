import { Express, Router, Request, Response } from "express";
import { UploadController } from "../controllers/network/Upload.controller";
import { validateRequest } from "../middlewares/valid_request.middleware";
import { GraphSchema } from "../../application/shared/models/entities/Node.entity";

export const NetworkRoute = (app: Express) => {
    const router = Router();

    router.get("/health", (_: Request, res: Response) => {
        res.status(200).json({ status: "ok" });
    });

    router.post(
        "/upload",
        validateRequest(GraphSchema),
        async (req: Request, res: Response) => await UploadController(req, res),
    );

    app.use("/network", router);
};
