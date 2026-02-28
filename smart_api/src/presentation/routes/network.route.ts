import { Express, Router, Request, Response } from "express";
import { UploadController } from "@/presentation/controllers/network/Upload.controller";
import { ReadNodesController } from "@/presentation/controllers/network/ReadNodes.controller";
import { validateRequest } from "@/presentation/middlewares/valid_request.middleware";
import { GraphSchema } from "@/application/shared/models/entities/Graph.entity";

export const NetworkRoute = (app: Express) => {
    const router = Router();

    // ─────────────────────────────────────
    // Health Check
    // ─────────────────────────────────────
    router.get("/health", (_: Request, res: Response) => {
        res.status(200).json({ status: "ok" });
    });

    // ─────────────────────────────────────
    // Create Graph
    // ─────────────────────────────────────
    router.post(
        "/upload",
        validateRequest(GraphSchema),
        async (req: Request, res: Response) => await UploadController(req, res),
    );

    // ─────────────────────────────────────
    // Read Graph by ID
    // ─────────────────────────────────────
    router.get(
        "/nodes/:id",
        async (req: Request, res: Response) => await ReadNodesController(req, res),
    );

    app.use("/network", router);
};
