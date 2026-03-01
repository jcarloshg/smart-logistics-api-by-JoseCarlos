export interface Edge {
    from: string;
    to: string;
    cost: number;
}

export interface Graph {
    edges: Edge[];
}

export interface AStarResult {
    path: string[];
    totalCost: number;
}

export interface HeuristicFunction {
    (node: string): number;
}

export class AStarAlgorithm {
    private heuristic: HeuristicFunction;

    constructor(heuristic: HeuristicFunction = () => 0) {
        this.heuristic = heuristic;
    }

    public execute(graph: Graph, start: string, end: string): AStarResult {
        const { edges } = graph;

        const adjacencyList = this.buildAdjacencyList(edges);
        const allNodes = this.getAllNodes(edges);

        if (!allNodes.has(start) || !allNodes.has(end)) {
            return { path: [], totalCost: Infinity };
        }

        const gScores = this.initializeDistances(allNodes, start);
        const fScores = this.initializeDistances(allNodes, start);
        const previous = this.initializePrevious(allNodes);
        const openSet = new Set<string>([start]);
        const closedSet = new Set<string>();

        fScores.set(start, this.heuristic(start));

        while (openSet.size > 0) {
            const current = this.findLowestFScore(openSet, fScores);

            if (current === null) {
                break;
            }

            if (current === end) {
                const path = this.reconstructPath(previous, end);
                const totalCost = gScores.get(end) ?? Infinity;
                return { path, totalCost };
            }

            openSet.delete(current);
            closedSet.add(current);

            this.updateNeighbors(current, adjacencyList, gScores, fScores, previous, openSet, closedSet, end);
        }

        return { path: [], totalCost: Infinity };
    }

    private buildAdjacencyList(edges: Edge[]): Map<string, Array<{ node: string; cost: number }>> {
        const adjacencyList = new Map<string, Array<{ node: string; cost: number }>>();

        edges.forEach((edge) => {
            if (!adjacencyList.has(edge.from)) {
                adjacencyList.set(edge.from, []);
            }
            adjacencyList.get(edge.from)!.push({
                node: edge.to,
                cost: edge.cost
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

    private findLowestFScore(openSet: Set<string>, fScores: Map<string, number>): string | null {
        let lowestNode: string | null = null;
        let lowestScore = Infinity;

        openSet.forEach((node) => {
            const score = fScores.get(node) ?? Infinity;
            if (score < lowestScore) {
                lowestScore = score;
                lowestNode = node;
            }
        });

        return lowestNode;
    }

    private updateNeighbors(
        current: string,
        adjacencyList: Map<string, Array<{ node: string; cost: number }>>,
        gScores: Map<string, number>,
        fScores: Map<string, number>,
        previous: Map<string, string | null>,
        openSet: Set<string>,
        closedSet: Set<string>,
        end: string
    ): void {
        const neighbors = adjacencyList.get(current) ?? [];
        const currentGScore = gScores.get(current) ?? Infinity;

        neighbors.forEach((neighbor) => {
            if (closedSet.has(neighbor.node)) {
                return;
            }

            const tentativeGScore = currentGScore + neighbor.cost;
            const currentGNebScore = gScores.get(neighbor.node) ?? Infinity;

            if (tentativeGScore < currentGNebScore) {
                previous.set(neighbor.node, current);
                gScores.set(neighbor.node, tentativeGScore);
                fScores.set(neighbor.node, tentativeGScore + this.heuristic(neighbor.node));

                if (!openSet.has(neighbor.node)) {
                    openSet.add(neighbor.node);
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

    public setHeuristic(heuristic: HeuristicFunction): void {
        this.heuristic = heuristic;
    }
}
