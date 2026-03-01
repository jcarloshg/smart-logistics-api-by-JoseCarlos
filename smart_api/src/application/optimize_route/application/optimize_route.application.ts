import { GraphRepository } from "@/application/shared/models/repositories/Graph.repository";
import { DijkstraAlgorithm } from "../models/DijkstraAlgorithm";
import { OptimizeRouteSchema } from "../models/optimize_route_request.entity";
import { CustomResponseFactory } from "@/application/shared/models/entities/CustomResponseFactory";

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
                const errors = validation.error.issues.map((e) => ({ field: e.path.join('.'), message: e.message }));
                return CustomResponseFactory.badRequest("Validation failed", errors);
            }

            const { originNodeId, destinationNodeId } = validation.data;

            // ─────────────────────────────────────
            // validate business rules
            // ─────────────────────────────────────
            if (originNodeId === destinationNodeId) {
                return CustomResponseFactory.badRequest("Origin and destination must be different");
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
            const result = this.dijkstra.execute(graph.graph, originNodeId, destinationNodeId);

            if (!result.path || result.path.length === 0) {
                return CustomResponseFactory.notFound(`No route found from ${originNodeId} to ${destinationNodeId}`);
            }

            return CustomResponseFactory.ok("Route optimized successfully", {
                graphId: graphId,
                origin: originNodeId,
                destination: destinationNodeId,
                path: result.path,
                totalCost: result.totalCost,
            });
        } catch (error) {
            console.error("Error optimizing route:", error);
            return CustomResponseFactory.internalServerError("Failed to optimize route");
        }
    }
}
