/**
 * @jest-environment node
 */
import { describe, it, expect, beforeEach } from '@jest/globals';
import { DijkstraAlgorithm, Graph, Edge, COST_SELECTORS, RouteConstraints, createConstraintFilter } from '@/application/optimize_route/models/DijkstraAlgorithm';

describe('DijkstraAlgorithm', () => {
    let dijkstra: DijkstraAlgorithm;

    beforeEach(() => {
        dijkstra = new DijkstraAlgorithm();
    });

    const createGraph = (edges: Edge[]): Graph => ({ edges });

    describe.each([
        { costSelector: COST_SELECTORS.distance, label: 'distance' },
        { costSelector: COST_SELECTORS.time, label: 'time' },
    ])('execute with $label cost selector', ({ costSelector }) => {
        it('should find path in simple graph', () => {
            const graph = createGraph([
                { from: 'A', to: 'B', distance: 5, time: 10 },
                { from: 'B', to: 'C', distance: 3, time: 6 },
            ]);

            const result = dijkstra.execute(graph, 'A', 'C', costSelector);

            expect(result.path).toEqual(['A', 'B', 'C']);
        });

        it('should return empty path for unreachable node', () => {
            const graph = createGraph([
                { from: 'A', to: 'B', distance: 5, time: 10 },
            ]);

            const result = dijkstra.execute(graph, 'A', 'X', costSelector);

            expect(result.path).toEqual([]);
            expect(result.totalCost).toBe(Infinity);
        });
    });

    describe('execute - basic shortest path', () => {
        it('should find the shortest path between two nodes', () => {
            const graph = createGraph([
                { from: 'A', to: 'B', distance: 4, time: 4 },
                { from: 'A', to: 'C', distance: 2, time: 2 },
                { from: 'B', to: 'C', distance: 1, time: 1 },
                { from: 'B', to: 'D', distance: 5, time: 5 },
                { from: 'C', to: 'D', distance: 8, time: 8 },
                { from: 'C', to: 'E', distance: 10, time: 10 },
                { from: 'D', to: 'E', distance: 2, time: 2 },
            ]);

            const result = dijkstra.execute(graph, 'A', 'E', COST_SELECTORS.distance);

            expect(result.path).toEqual(['A', 'B', 'D', 'E']);
            expect(result.totalCost).toBe(11);
        });

        it('should return direct path when it is the shortest', () => {
            const graph = createGraph([
                { from: 'A', to: 'B', distance: 5, time: 5 },
                { from: 'A', to: 'C', distance: 10, time: 10 },
                { from: 'B', to: 'C', distance: 3, time: 3 },
            ]);

            const result = dijkstra.execute(graph, 'A', 'B', COST_SELECTORS.distance);

            expect(result.path).toEqual(['A', 'B']);
            expect(result.totalCost).toBe(5);
        });

        it('should return empty path when start node does not exist', () => {
            const graph = createGraph([
                { from: 'A', to: 'B', distance: 5, time: 5 },
                { from: 'B', to: 'C', distance: 3, time: 3 },
            ]);

            const result = dijkstra.execute(graph, 'X', 'C', COST_SELECTORS.distance);

            expect(result.path).toEqual([]);
            expect(result.totalCost).toBe(Infinity);
        });

        it('should return empty path when end node does not exist', () => {
            const graph = createGraph([
                { from: 'A', to: 'B', distance: 5, time: 5 },
                { from: 'B', to: 'C', distance: 3, time: 3 },
            ]);

            const result = dijkstra.execute(graph, 'A', 'X', COST_SELECTORS.distance);

            expect(result.path).toEqual([]);
            expect(result.totalCost).toBe(Infinity);
        });

        it('should return single node path when start and end are the same', () => {
            const graph = createGraph([
                { from: 'A', to: 'B', distance: 5, time: 5 },
                { from: 'B', to: 'C', distance: 3, time: 3 },
            ]);

            const result = dijkstra.execute(graph, 'A', 'A', COST_SELECTORS.distance);

            expect(result.path).toEqual(['A']);
            expect(result.totalCost).toBe(0);
        });

        it('should return empty path when no path exists between nodes', () => {
            const graph = createGraph([
                { from: 'A', to: 'B', distance: 5, time: 5 },
                { from: 'C', to: 'D', distance: 3, time: 3 },
            ]);

            const result = dijkstra.execute(graph, 'A', 'D', COST_SELECTORS.distance);

            expect(result.path).toEqual([]);
            expect(result.totalCost).toBe(Infinity);
        });

        it('should handle graph with single edge', () => {
            const graph = createGraph([
                { from: 'A', to: 'B', distance: 10, time: 10 },
            ]);

            const result = dijkstra.execute(graph, 'A', 'B', COST_SELECTORS.distance);

            expect(result.path).toEqual(['A', 'B']);
            expect(result.totalCost).toBe(10);
        });

        it('should handle graph with multiple edges to the same node', () => {
            const graph = createGraph([
                { from: 'A', to: 'B', distance: 10, time: 10 },
                { from: 'A', to: 'C', distance: 5, time: 5 },
                { from: 'B', to: 'D', distance: 3, time: 3 },
                { from: 'C', to: 'D', distance: 8, time: 8 },
            ]);

            const result = dijkstra.execute(graph, 'A', 'D', COST_SELECTORS.distance);

            expect(result.path).toEqual(['A', 'C', 'D']);
            expect(result.totalCost).toBe(13);
        });

        it('should handle empty graph', () => {
            const graph = createGraph([]);

            const result = dijkstra.execute(graph, 'A', 'B', COST_SELECTORS.distance);

            expect(result.path).toEqual([]);
            expect(result.totalCost).toBe(Infinity);
        });

        it('should handle linear path', () => {
            const graph = createGraph([
                { from: 'A', to: 'B', distance: 1, time: 1 },
                { from: 'B', to: 'C', distance: 2, time: 2 },
                { from: 'C', to: 'D', distance: 3, time: 3 },
                { from: 'D', to: 'E', distance: 4, time: 4 },
            ]);

            const result = dijkstra.execute(graph, 'A', 'E', COST_SELECTORS.distance);

            expect(result.path).toEqual(['A', 'B', 'C', 'D', 'E']);
            expect(result.totalCost).toBe(10);
        });
    });

    describe('execute - preference switching (shortest vs fastest)', () => {
        it('should find shortest path when preference is shortest', () => {
            const graph = createGraph([
                { from: 'A', to: 'B', distance: 80, time: 60 },
                { from: 'A', to: 'C', distance: 50, time: 120 },
                { from: 'B', to: 'D', distance: 50, time: 30 },
                { from: 'C', to: 'D', distance: 100, time: 20 },
            ]);

            const result = dijkstra.execute(graph, 'A', 'D', COST_SELECTORS.distance);

            expect(result.path).toEqual(['A', 'B', 'D']);
            expect(result.totalCost).toBe(130);
        });

        it('should find fastest path when preference is fastest', () => {
            const graph = createGraph([
                { from: 'A', to: 'B', distance: 80, time: 60 },
                { from: 'A', to: 'C', distance: 50, time: 20 },
                { from: 'B', to: 'D', distance: 50, time: 80 },
                { from: 'C', to: 'D', distance: 100, time: 30 },
            ]);

            const result = dijkstra.execute(graph, 'A', 'D', COST_SELECTORS.time);

            expect(result.path).toEqual(['A', 'C', 'D']);
            expect(result.totalCost).toBe(50);
        });

        it('should use distance by default when no costSelector is provided', () => {
            const graph = createGraph([
                { from: 'A', to: 'B', distance: 10, time: 100 },
                { from: 'A', to: 'C', distance: 5, time: 10 },
                { from: 'B', to: 'D', distance: 5, time: 10 },
                { from: 'C', to: 'D', distance: 20, time: 5 },
            ]);

            const result = dijkstra.execute(graph, 'A', 'D');

            expect(result.path).toEqual(['A', 'B', 'D']);
            expect(result.totalCost).toBe(15);
        });
    });

    describe('execute - constraint filtering (avoidHighways)', () => {
        it('should find path avoiding highways when avoidHighways is true', () => {
            const graph = createGraph([
                { from: 'A', to: 'B', distance: 10, time: 5, type: 'highway' },
                { from: 'A', to: 'C', distance: 20, time: 15, type: 'road' },
                { from: 'B', to: 'D', distance: 10, time: 5, type: 'highway' },
                { from: 'C', to: 'D', distance: 25, time: 20, type: 'road' },
                { from: 'D', to: 'E', distance: 10, time: 5, type: 'highway' },
                { from: 'C', to: 'E', distance: 30, time: 25, type: 'street' },
            ]);

            const constraints: RouteConstraints = { avoidHighways: true };
            const result = dijkstra.execute(graph, 'A', 'E', COST_SELECTORS.distance, constraints);

            expect(result.path).toEqual(['A', 'C', 'E']);
            expect(result.totalCost).toBe(50);
        });

        it('should use highway path when avoidHighways is false', () => {
            const graph = createGraph([
                { from: 'A', to: 'B', distance: 10, time: 5, type: 'highway' },
                { from: 'A', to: 'C', distance: 20, time: 15, type: 'road' },
                { from: 'B', to: 'D', distance: 10, time: 5, type: 'highway' },
                { from: 'C', to: 'D', distance: 25, time: 20, type: 'road' },
                { from: 'D', to: 'E', distance: 10, time: 5, type: 'highway' },
                { from: 'C', to: 'E', distance: 30, time: 25, type: 'street' },
            ]);

            const constraints: RouteConstraints = { avoidHighways: false };
            const result = dijkstra.execute(graph, 'A', 'E', COST_SELECTORS.distance, constraints);

            expect(result.path).toEqual(['A', 'B', 'D', 'E']);
            expect(result.totalCost).toBe(30);
        });

        it('should return no path when all paths use highways and avoidHighways is true', () => {
            const graph = createGraph([
                { from: 'A', to: 'B', distance: 10, time: 5, type: 'highway' },
                { from: 'A', to: 'C', distance: 20, time: 15, type: 'highway' },
                { from: 'B', to: 'D', distance: 10, time: 5, type: 'highway' },
                { from: 'C', to: 'D', distance: 25, time: 20, type: 'highway' },
            ]);

            const constraints: RouteConstraints = { avoidHighways: true };
            const result = dijkstra.execute(graph, 'A', 'D', COST_SELECTORS.distance, constraints);

            expect(result.path).toEqual([]);
            expect(result.totalCost).toBe(Infinity);
        });

        it('should work with no constraints (default behavior)', () => {
            const graph = createGraph([
                { from: 'A', to: 'B', distance: 10, time: 5, type: 'highway' },
                { from: 'A', to: 'C', distance: 20, time: 15, type: 'road' },
                { from: 'B', to: 'D', distance: 10, time: 5, type: 'highway' },
                { from: 'C', to: 'D', distance: 25, time: 20, type: 'road' },
            ]);

            const result = dijkstra.execute(graph, 'A', 'D', COST_SELECTORS.distance);

            expect(result.path).toEqual(['A', 'B', 'D']);
            expect(result.totalCost).toBe(20);
        });

        it('should combine preference and constraints', () => {
            const graph = createGraph([
                { from: 'A', to: 'B', distance: 10, time: 100, type: 'highway' },
                { from: 'A', to: 'C', distance: 20, time: 10, type: 'road' },
                { from: 'B', to: 'D', distance: 10, time: 100, type: 'highway' },
                { from: 'C', to: 'D', distance: 25, time: 20, type: 'road' },
                { from: 'D', to: 'E', distance: 10, time: 100, type: 'highway' },
                { from: 'C', to: 'E', distance: 30, time: 15, type: 'street' },
            ]);

            const constraints: RouteConstraints = { avoidHighways: true };
            const result = dijkstra.execute(graph, 'A', 'E', COST_SELECTORS.time, constraints);

            expect(result.path).toEqual(['A', 'C', 'E']);
            expect(result.totalCost).toBe(25);
        });
    });

    describe('createConstraintFilter', () => {
        it('should return Infinity for highway edges when avoidHighways is true', () => {
            const filter = createConstraintFilter({ avoidHighways: true });

            const highwayEdge: Edge = { from: 'A', to: 'B', distance: 10, time: 5, type: 'highway' };
            const roadEdge: Edge = { from: 'A', to: 'C', distance: 20, time: 15, type: 'road' };

            expect(filter(highwayEdge)).toBe(Infinity);
            expect(filter(roadEdge)).toBe(0);
        });

        it('should return 0 for all edges when avoidHighways is false', () => {
            const filter = createConstraintFilter({ avoidHighways: false });

            const highwayEdge: Edge = { from: 'A', to: 'B', distance: 10, time: 5, type: 'highway' };
            const roadEdge: Edge = { from: 'A', to: 'C', distance: 20, time: 15, type: 'road' };

            expect(filter(highwayEdge)).toBe(0);
            expect(filter(roadEdge)).toBe(0);
        });

        it('should return 0 when no constraints provided', () => {
            const filter = createConstraintFilter(undefined);

            const highwayEdge: Edge = { from: 'A', to: 'B', distance: 10, time: 5, type: 'highway' };

            expect(filter(highwayEdge)).toBe(0);
        });

        it('should handle edges without type field', () => {
            const filter = createConstraintFilter({ avoidHighways: true });

            const noTypeEdge: Edge = { from: 'A', to: 'B', distance: 10, time: 5 };

            expect(filter(noTypeEdge)).toBe(0);
        });
    });
});
