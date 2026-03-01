export interface Edge {
    from: string;
    to: string;
    distance: number;
    time: number;
}

export interface Graph {
    edges: Edge[];
}

export type CostType = 'distance' | 'time';
export type CostSelector = (edge: Edge) => number;

export const COST_SELECTORS: Record<CostType, CostSelector> = {
    distance: (edge: Edge) => edge.distance,
    time: (edge: Edge) => edge.time,
};

export interface DijkstraResult {
    path: string[];
    totalCost: number;
}

export class DijkstraAlgorithm {
    public execute(graph: Graph, start: string, end: string, costSelector: CostSelector = COST_SELECTORS.distance): DijkstraResult {
        const { edges } = graph;

        const adjacencyList = this.buildAdjacencyList(edges, costSelector);
        const allNodes = this.getAllNodes(edges);

        if (!allNodes.has(start) || !allNodes.has(end)) {
            return { path: [], totalCost: Infinity };
        }

        const distances = this.initializeDistances(allNodes, start);
        const previous = this.initializePrevious(allNodes);
        const unvisited = new Set(allNodes);

        while (unvisited.size > 0) {
            const { minNode, minDistance } = this.findMinDistanceNode(unvisited, distances);

            if (minNode === null || minDistance === Infinity) {
                break;
            }

            unvisited.delete(minNode);

            this.updateNeighbors(minNode, adjacencyList, distances, previous, unvisited);
        }

        const path = this.reconstructPath(previous, end);
        const totalCost = distances.get(end) ?? Infinity;

        if (path.length === 0 || path[0] !== start) {
            return { path: [], totalCost: Infinity };
        }

        return { path, totalCost };
    }

    private buildAdjacencyList(edges: Edge[], costSelector: CostSelector): Map<string, Array<{ node: string; cost: number }>> {
        const adjacencyList = new Map<string, Array<{ node: string; cost: number }>>();

        edges.forEach((edge) => {
            if (!adjacencyList.has(edge.from)) {
                adjacencyList.set(edge.from, []);
            }
            adjacencyList.get(edge.from)!.push({
                node: edge.to,
                cost: costSelector(edge)
            });
        });

        return adjacencyList;
    }

    private getAllNodes(edges: Edge[]): Set<string> {
        const allNodes = new Set<string>();
        edges.forEach((edge) => {
            allNodes.add(edge.from);
            allNodes.add(edge.to);
        });
        return allNodes;
    }

    private initializeDistances(nodes: Set<string>, start: string): Map<string, number> {
        const distances = new Map<string, number>();
        nodes.forEach((node) => {
            distances.set(node, node === start ? 0 : Infinity);
        });
        return distances;
    }

    private initializePrevious(nodes: Set<string>): Map<string, string | null> {
        const previous = new Map<string, string | null>();
        nodes.forEach((node) => {
            previous.set(node, null);
        });
        return previous;
    }

    private findMinDistanceNode(unvisited: Set<string>, distances: Map<string, number>): { minNode: string | null; minDistance: number } {
        let minNode: string | null = null;
        let minDistance = Infinity;

        unvisited.forEach((node) => {
            const dist = distances.get(node) ?? Infinity;
            if (dist < minDistance) {
                minDistance = dist;
                minNode = node;
            }
        });

        return { minNode, minDistance };
    }

    private updateNeighbors(
        minNode: string,
        adjacencyList: Map<string, Array<{ node: string; cost: number }>>,
        distances: Map<string, number>,
        previous: Map<string, string | null>,
        unvisited: Set<string>
    ): void {
        const neighbors = adjacencyList.get(minNode) ?? [];
        const currentDistance = distances.get(minNode) ?? Infinity;

        neighbors.forEach((neighbor) => {
            if (unvisited.has(neighbor.node)) {
                const newDistance = currentDistance + neighbor.cost;
                const currentNeighborDistance = distances.get(neighbor.node) ?? Infinity;

                if (newDistance < currentNeighborDistance) {
                    distances.set(neighbor.node, newDistance);
                    previous.set(neighbor.node, minNode);
                }
            }
        });
    }

    private reconstructPath(previous: Map<string, string | null>, end: string): string[] {
        const path: string[] = [];
        let current: string | null = end;

        while (current !== null) {
            path.unshift(current);
            current = previous.get(current) ?? null;
        }

        return path;
    }
}
