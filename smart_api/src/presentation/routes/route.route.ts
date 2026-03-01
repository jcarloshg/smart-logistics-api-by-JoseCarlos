import { Express, Router, Request, Response } from "express";
import { OptimizeRouteController } from "@/presentation/controllers/route/OptimizeRoute.controller";

export const RouteRoute = (app: Express) => {
    const router = Router();

    /**
     * @swagger
     * /route/optimize/{id}:
     *   post:
     *     summary: Optimize route using Dijkstra's algorithm
     *     tags: [Route]
     *     description: |
     *       Finds the optimal path between two nodes in a graph using Dijkstra's algorithm.
     *       The algorithm calculates the shortest path based on the edge costs (weights).
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Unique identifier of the graph to use for route optimization
     *         example: "abc123"
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/OptimizeRouteRequest'
     *           example:
     *             originNodeId: "A"
     *             destinationNodeId: "C"
     *     responses:
     *       200:
     *         description: Optimal route found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 data:
     *                   type: object
     *                   properties:
     *                     graphId:
     *                       type: string
     *                     totalCost:
     *                       type: number
     *                     path:
     *                       type: array
     *                       items:
     *                         type: string
     *                     durationMs:
     *                       type: number
     *             example:
     *               message: "Route optimized successfully"
     *               data:
     *                 graphId: "abc123"
     *                 totalCost: 25
     *                 path: ["A", "B", "C"]
     *                 durationMs: 5
     *       400:
     *         description: Invalid request (validation failed or origin equals destination)
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *             example:
     *               message: "Validation failed"
     *               data: [{"field": "originNodeId", "message": "Required"}]
     *       404:
     *         description: Graph not found or no route exists between nodes
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *             examples:
     *               graphNotFound:
     *                 summary: Graph not found
     *                 value:
     *                   message: "Graph not found"
     *                   data: null
     *               noRouteFound:
     *                 summary: No route found
     *                 value:
     *                   message: "No route found from A to C"
     *                   data: null
     *       500:
     *         description: Internal server error
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *             example:
     *               message: "Failed to optimize route"
     *               data: null
     */
    router.post(
        "/optimize/:id",
        async (req: Request, res: Response) => await OptimizeRouteController(req, res),
    );

    app.use("/route", router);
};
