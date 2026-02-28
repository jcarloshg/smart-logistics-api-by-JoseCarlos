import { Express, Router, Request, Response } from "express";
import { OptimizeRouteController } from "@/presentation/controllers/route/OptimizeRoute.controller";

export const RouteRoute = (app: Express) => {
    const router = Router();

    // ─────────────────────────────────────
    // Optimize Route - Dijkstra's Algorithm
    // ─────────────────────────────────────
    router.post(
        "/optimize/:id",
        async (req: Request, res: Response) => await OptimizeRouteController(req, res),
    );

    app.use("/route", router);
};
