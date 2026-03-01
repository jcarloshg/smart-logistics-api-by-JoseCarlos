import { DijkstraAlgorithm, Graph, Edge } from '@/application/optimize_route/models/DijkstraAlgorithm';

describe('DijkstraAlgorithm', () => {
    let dijkstra: DijkstraAlgorithm;

    beforeEach(() => {
        dijkstra = new DijkstraAlgorithm();
    });

    const createGraph = (edges: Edge[]): Graph => ({ edges });

    describe('execute', () => {
        it('should find the shortest path between two nodes', () => {
            const graph = createGraph([
                { from: 'A', to: 'B', cost: 4 },
                { from: 'A', to: 'C', cost: 2 },
                { from: 'B', to: 'C', cost: 1 },
                { from: 'B', to: 'D', cost: 5 },
                { from: 'C', to: 'D', cost: 8 },
                { from: 'C', to: 'E', cost: 10 },
                { from: 'D', to: 'E', cost: 2 },
            ]);

            const result = dijkstra.execute(graph, 'A', 'E');

            expect(result.path).toEqual(['A', 'B', 'D', 'E']);
            expect(result.totalCost).toBe(11);
        });

        it('should return direct path when it is the shortest', () => {
            const graph = createGraph([
                { from: 'A', to: 'B', cost: 5 },
                { from: 'A', to: 'C', cost: 10 },
                { from: 'B', to: 'C', cost: 3 },
            ]);

            const result = dijkstra.execute(graph, 'A', 'B');

            expect(result.path).toEqual(['A', 'B']);
            expect(result.totalCost).toBe(5);
        });

        it('should return empty path when start node does not exist', () => {
            const graph = createGraph([
                { from: 'A', to: 'B', cost: 5 },
                { from: 'B', to: 'C', cost: 3 },
            ]);

            const result = dijkstra.execute(graph, 'X', 'C');

            expect(result.path).toEqual([]);
            expect(result.totalCost).toBe(Infinity);
        });

        it('should return empty path when end node does not exist', () => {
            const graph = createGraph([
                { from: 'A', to: 'B', cost: 5 },
                { from: 'B', to: 'C', cost: 3 },
            ]);

            const result = dijkstra.execute(graph, 'A', 'X');

            expect(result.path).toEqual([]);
            expect(result.totalCost).toBe(Infinity);
        });

        it('should return single node path when start and end are the same', () => {
            const graph = createGraph([
                { from: 'A', to: 'B', cost: 5 },
                { from: 'B', to: 'C', cost: 3 },
            ]);

            const result = dijkstra.execute(graph, 'A', 'A');

            expect(result.path).toEqual(['A']);
            expect(result.totalCost).toBe(0);
        });

        it('should return empty path when no path exists between nodes', () => {
            const graph = createGraph([
                { from: 'A', to: 'B', cost: 5 },
                { from: 'C', to: 'D', cost: 3 },
            ]);

            const result = dijkstra.execute(graph, 'A', 'D');

            expect(result.path).toEqual([]);
            expect(result.totalCost).toBe(Infinity);
        });

        it('should handle graph with single edge', () => {
            const graph = createGraph([
                { from: 'A', to: 'B', cost: 10 },
            ]);

            const result = dijkstra.execute(graph, 'A', 'B');

            expect(result.path).toEqual(['A', 'B']);
            expect(result.totalCost).toBe(10);
        });

        it('should handle graph with multiple edges to the same node', () => {
            const graph = createGraph([
                { from: 'A', to: 'B', cost: 10 },
                { from: 'A', to: 'C', cost: 5 },
                { from: 'B', to: 'D', cost: 3 },
                { from: 'C', to: 'D', cost: 8 },
            ]);

            const result = dijkstra.execute(graph, 'A', 'D');

            expect(result.path).toEqual(['A', 'C', 'D']);
            expect(result.totalCost).toBe(13);
        });

        it('should handle empty graph', () => {
            const graph = createGraph([]);

            const result = dijkstra.execute(graph, 'A', 'B');

            expect(result.path).toEqual([]);
            expect(result.totalCost).toBe(Infinity);
        });

        it('should handle linear path', () => {
            const graph = createGraph([
                { from: 'A', to: 'B', cost: 1 },
                { from: 'B', to: 'C', cost: 2 },
                { from: 'C', to: 'D', cost: 3 },
                { from: 'D', to: 'E', cost: 4 },
            ]);

            const result = dijkstra.execute(graph, 'A', 'E');

            expect(result.path).toEqual(['A', 'B', 'C', 'D', 'E']);
            expect(result.totalCost).toBe(10);
        });
    });
});
