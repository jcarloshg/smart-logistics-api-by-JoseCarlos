import { GraphRepository } from "@/application/shared/models/repositories/Graph.repository";
import { DijkstraAlgorithm } from "../models/DijkstraAlgorithm";

export class OptimizeRouteApplication {
    private graphRepository: GraphRepository;
    private dijkstra: DijkstraAlgorithm;

    constructor(graphRepository: GraphRepository) {
        this.graphRepository = graphRepository;
        this.dijkstra = new DijkstraAlgorithm();
    }

    public async execute(
        graphId: string,
        origin: string,
        destination: string,
    ): Promise<OptimizeRouteAppResponse> {
        try {
            console.log(
                `Optimizing route from ${origin} to ${destination} in graph ${graphId}`,
            );

            if (!origin || !destination) {
                return {
                    wasSucces: false,
                    message: "Origin and destination nodes are required",
                    data: null,
                };
            }

            if (origin === destination) {
                return {
                    wasSucces: false,
                    message: "Origin and destination must be different",
                    data: null,
                };
            }

            const graph = await this.graphRepository.readById(graphId);

            if (!graph) {
                return {
                    wasSucces: false,
                    message: "Graph not found",
                    data: null,
                };
            }

            const result = this.dijkstra.execute(graph.graph, origin, destination);

            if (!result.path || result.path.length === 0) {
                return {
                    wasSucces: false,
                    message: `No route found from ${origin} to ${destination}`,
                    data: null,
                };
            }

            return {
                wasSucces: true,
                message: "Route optimized successfully",
                data: {
                    graphId: graphId,
                    origin: origin,
                    destination: destination,
                    path: result.path,
                    totalCost: result.totalCost,
                },
            };
        } catch (error) {
            console.error("Error optimizing route:", error);
            return {
                wasSucces: false,
                message: "Failed to optimize route",
                data: null,
            };
        }
    }
}

export interface OptimizeRouteAppResponse {
    wasSucces: boolean;
    message: string;
    data?: any;
}
