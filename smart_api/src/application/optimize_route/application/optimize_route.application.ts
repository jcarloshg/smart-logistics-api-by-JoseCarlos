import { GraphRepository } from '@/application/shared/models/repositories/Graph.repository';

export class OptimizeRouteApplication {
    private graphRepository: GraphRepository;

    constructor(graphRepository: GraphRepository) {
        this.graphRepository = graphRepository;
    }

    public async execute(graphId: string, origin: string, destination: string): Promise<OptimizeRouteAppResponse> {
        try {
            console.log(`Optimizing route from ${origin} to ${destination} in graph ${graphId}`);

            // Validate inputs
            if (!origin || !destination) {
                return {
                    wasSucces: false,
                    message: 'Origin and destination nodes are required',
                    data: null
                };
            }

            if (origin === destination) {
                return {
                    wasSucces: false,
                    message: 'Origin and destination must be different',
                    data: null
                };
            }

            // Get graph
            const graph = await this.graphRepository.readById(graphId);

            if (!graph) {
                return {
                    wasSucces: false,
                    message: 'Graph not found',
                    data: null
                };
            }

            // Run Dijkstra's algorithm
            const result = this.dijkstra(graph.graph, origin, destination);

            if (!result.path || result.path.length === 0) {
                return {
                    wasSucces: false,
                    message: `No route found from ${origin} to ${destination}`,
                    data: null
                };
            }

            return {
                wasSucces: true,
                message: 'Route optimized successfully',
                data: {
                    graphId: graphId,
                    origin: origin,
                    destination: destination,
                    path: result.path,
                    totalCost: result.totalCost
                }
            };
        } catch (error) {
            console.error('Error optimizing route:', error);
            return {
                wasSucces: false,
                message: 'Failed to optimize route',
                data: null
            };
        }
    }

    /**
     * Dijkstra's Algorithm Implementation
     * Finds the shortest path between two nodes in a weighted graph
     */
    private dijkstra(graph: any, start: string, end: string): { path: string[]; totalCost: number } {
        const edges = graph.edges || [];

        // Build adjacency list
        const adjacencyList: Map<string, Array<{ node: string; cost: number }>> = new Map();

        edges.forEach((edge: any) => {
            if (!adjacencyList.has(edge.from)) {
                adjacencyList.set(edge.from, []);
            }
            adjacencyList.get(edge.from)!.push({
                node: edge.to,
                cost: edge.cost
            });
        });

        // Initialize distances and visited set
        const distances: Map<string, number> = new Map();
        const previous: Map<string, string | null> = new Map();
        const unvisited: Set<string> = new Set();

        // Get all unique nodes
        const allNodes = new Set<string>();
        edges.forEach((edge: any) => {
            allNodes.add(edge.from);
            allNodes.add(edge.to);
        });

        // Initialize all distances to infinity except start
        allNodes.forEach(node => {
            distances.set(node, node === start ? 0 : Infinity);
            previous.set(node, null);
            unvisited.add(node);
        });

        // Main algorithm loop
        while (unvisited.size > 0) {
            // Find unvisited node with minimum distance
            let minNode: string | null = null;
            let minDistance = Infinity;

            unvisited.forEach(node => {
                const dist = distances.get(node) || Infinity;
                if (dist < minDistance) {
                    minDistance = dist;
                    minNode = node;
                }
            });

            if (minNode === null || minDistance === Infinity) {
                break;
            }

            unvisited.delete(minNode);

            // Update distances to neighbors
            const neighbors = adjacencyList.get(minNode) || [];
            neighbors.forEach(neighbor => {
                if (unvisited.has(neighbor.node)) {
                    const newDistance = (distances.get(minNode!) || Infinity) + neighbor.cost;
                    if (newDistance < (distances.get(neighbor.node) || Infinity)) {
                        distances.set(neighbor.node, newDistance);
                        previous.set(neighbor.node, minNode);
                    }
                }
            });
        }

        // Reconstruct path
        const path: string[] = [];
        let current: string | null = end;

        while (current !== null) {
            path.unshift(current);
            current = previous.get(current) || null;
        }

        // Check if path is valid
        if (path[0] !== start) {
            return { path: [], totalCost: Infinity };
        }

        const totalCost = distances.get(end) || Infinity;

        return { path, totalCost };
    }
}

export interface OptimizeRouteAppResponse {
    wasSucces: boolean;
    message: string;
    data?: any;
}
