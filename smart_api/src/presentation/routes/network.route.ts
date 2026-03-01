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
    /**
     * @swagger
     * /network/health:
     *   get:
     *     summary: Health check endpoint
     *     tags: [Network]
     *     description: Returns the health status of the API service
     *     responses:
     *       200:
     *         description: Service is healthy
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/HealthResponse'
     *             example:
     *               status: ok
     */
    router.get("/health", (_: Request, res: Response) => {
        res.status(200).json({ status: "ok" });
    });

    // ─────────────────────────────────────
    // Upload Graph
    // ─────────────────────────────────────
    /**
     * @swagger
     * /network/upload:
     *   post:
     *     summary: Upload graph data
     *     tags: [Network]
     *     description: Creates a new graph by uploading edges. Nodes are inferred from the edge definitions (from/to fields).
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Graph'
     *           example:
     *             edges:
     *               - from: "A"
     *                 to: "B"
     *                 distance: 10
     *                 time: 15
     *                 type: "road"
     *               - from: "B"
     *                 to: "C"
     *                 distance: 5
     *                 time: 8
     *                 type: "highway"
     *               - from: "A"
     *                 to: "C"
     *                 distance: 20
     *                 time: 30
     *                 type: "street"
     *     responses:
     *       201:
     *         description: Graph created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/CreateGraphResponse'
     *       400:
     *         description: Invalid request body
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    router.post(
        "/upload",
        validateRequest(GraphSchema),
        async (req: Request, res: Response) => await UploadController(req, res),
    );

    // ─────────────────────────────────────
    // Get Nodes
    // ─────────────────────────────────────
    /**
     * @swagger
     * /network/nodes/{id}:
     *   get:
     *     summary: Get graph nodes by ID
     *     tags: [Network]
     *     description: Retrieves the edges/nodes of a previously uploaded graph
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Unique identifier of the graph
     *         example: "abc123"
    *     responses:
    *       200:
    *         description: Graph edges retrieved successfully
    *         content:
    *           application/json:
    *             schema:
    *               $ref: '#/components/schemas/NodesResponse'
    *       400:
    *         description: Invalid graph ID
    *         content:
    *           application/json:
    *             schema:
    *               $ref: '#/components/schemas/Error'
    *       404:
    *         description: Graph not found
    *         content:
    *           application/json:
    *             schema:
    *               $ref: '#/components/schemas/Error'
    *             example:
    *               message: "Graph not found"
    *               data: null
     */
    router.get(
        "/nodes/:id",
        async (req: Request, res: Response) => await ReadNodesController(req, res),
    );

    app.use("/network", router);
};
