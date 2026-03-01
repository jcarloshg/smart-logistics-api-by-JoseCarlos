import { DijkstraAlgorithm, COST_SELECTORS } from "@/src/application/optimize_route/models/DijkstraAlgorithm";
import { OptimizeRouteResponse } from "@/src/application/optimize_route/models/optimize_route.response.entity";
import { OptimizeRouteSchema } from "@/src/application/optimize_route/models/optimize_route_request.entity";
import { GraphRepository } from "@/src/application/shared/models/repositories/Graph.repository";
import { CustomResponseFactory } from "@/src/application/shared/models/entities/CustomResponseFactory";

export class OptimizeRouteApplication {
    private graphRepository: GraphRepository;
    private dijkstra: DijkstraAlgorithm;

    constructor(graphRepository: GraphRepository) {
        this.graphRepository = graphRepository;
        this.dijkstra = new DijkstraAlgorithm();
    }

    public async execute(graphId: string, body: any): Promise<any> {
        try {
            // ─────────────────────────────────────
            // validate body
            // ─────────────────────────────────────
            const validation = OptimizeRouteSchema.safeParse(body);
            if (!validation.success) {
                const errors = validation.error.issues.map((e) => ({
                    field: e.path.join("."),
                    message: e.message,
                }));
                return CustomResponseFactory.badRequest("Validation failed", errors);
            }

            const { originNodeId, destinationNodeId, preference, constraints } = validation.data;

            // ─────────────────────────────────────
            // validate business rules
            // ─────────────────────────────────────
            if (originNodeId === destinationNodeId) {
                return CustomResponseFactory.badRequest(
                    "Origin and destination must be different",
                );
            }

            // ─────────────────────────────────────
            // execute use case
            // ─────────────────────────────────────

            // find graph
            const graph = await this.graphRepository.readById(graphId);
            if (!graph) {
                return CustomResponseFactory.notFound("Graph not found");
            }

            // execute dijkstra
            const costSelector = preference === 'shortest' ? COST_SELECTORS.distance : COST_SELECTORS.time;
            const startTime = Date.now();
            const result = this.dijkstra.execute(
                graph.graph,
                originNodeId,
                destinationNodeId,
                costSelector,
                constraints,
            );
            const durationMs = Date.now() - startTime;

            if (!result.path || result.path.length === 0) {
                return CustomResponseFactory.notFound(
                    `No route found from ${originNodeId} to ${destinationNodeId}`,
                );
            }

            const response: OptimizeRouteResponse = {
                graphId: graphId,
                totalCost: result.totalCost,
                path: result.path,
                durationMs: durationMs,
                preference: preference,
                constraints: constraints,
            };

            return CustomResponseFactory.ok("Route optimized successfully", response);
        } catch (error) {
            console.error("Error optimizing route:", error);
            return CustomResponseFactory.internalServerError(
                "Failed to optimize route",
            );
        }
    }
}
