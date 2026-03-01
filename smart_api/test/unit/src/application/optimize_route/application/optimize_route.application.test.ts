/**
 * @jest-environment node
 */
import { describe, it, expect, jest, beforeEach, afterAll } from '@jest/globals';
import { OptimizeRouteApplication } from '@/application/optimize_route/application/optimize_route.application';
import { GraphRepository } from '@/application/shared/models/repositories/Graph.repository';
import { COST_SELECTORS, DijkstraResult } from '@/application/optimize_route/models/DijkstraAlgorithm';

const mockExecute = jest.fn();

jest.mock('@/application/optimize_route/models/DijkstraAlgorithm', () => ({
    DijkstraAlgorithm: jest.fn().mockImplementation(() => ({
        execute: mockExecute,
    })),
    COST_SELECTORS: {
        distance: (edge: any) => edge.distance,
        time: (edge: any) => edge.time,
    },
}));

describe('OptimizeRouteApplication', () => {
    let app: OptimizeRouteApplication;
    let mockGraphRepository: any;
    let consoleSpy: ReturnType<typeof jest.spyOn>;

    beforeAll(() => {
        consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterAll(() => {
        consoleSpy.mockRestore();
    });

    beforeEach(() => {
        mockGraphRepository = {
            create: jest.fn(),
            readById: jest.fn(),
            readAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findByEdges: jest.fn(),
            exists: jest.fn(),
            count: jest.fn(),
        };

        jest.clearAllMocks();
        mockExecute.mockClear();
    });

    const createApp = () => new OptimizeRouteApplication(mockGraphRepository as GraphRepository);

    const validBody = {
        originNodeId: 'A',
        destinationNodeId: 'D',
        preference: 'shortest' as const,
        constraints: { avoidHighways: false },
    };

    const mockGraph = {
        graph: {
            edges: [
                { from: 'A', to: 'B', distance: 4, time: 4 },
                { from: 'A', to: 'C', distance: 2, time: 2 },
                { from: 'B', to: 'C', distance: 1, time: 1 },
                { from: 'B', to: 'D', distance: 5, time: 5 },
                { from: 'C', to: 'D', distance: 8, time: 8 },
            ],
        },
    };

    describe('execute', () => {
        describe('validation', () => {
            it('should return bad request when body validation fails', async () => {
                const invalidBody = { originNodeId: '' };
                app = createApp();

                const result = await app.execute('graph-id', invalidBody);

                expect(result.statusCode).toBe(400);
                expect(result.message).toBe('Validation failed');
                expect(result.data).toBeDefined();
            });

            it('should return bad request when origin and destination are the same', async () => {
                const sameNodeBody = {
                    originNodeId: 'A',
                    destinationNodeId: 'A',
                };
                app = createApp();

                const result = await app.execute('graph-id', sameNodeBody);

                expect(result.statusCode).toBe(400);
                expect(result.message).toBe('Origin and destination must be different');
            });
        });

        describe('graph retrieval', () => {
            it('should return not found when graph does not exist', async () => {
                mockGraphRepository.readById.mockResolvedValue(null);
                app = createApp();

                const result = await app.execute('non-existent-id', validBody);

                expect(mockGraphRepository.readById).toHaveBeenCalledWith('non-existent-id');
                expect(result.statusCode).toBe(404);
                expect(result.message).toBe('Graph not found');
            });
        });

        describe('route optimization', () => {
            it('should return optimized route successfully with shortest preference', async () => {
                mockGraphRepository.readById.mockResolvedValue(mockGraph);
                const dijkstraResult: DijkstraResult = {
                    path: ['A', 'B', 'D'],
                    totalCost: 9,
                };
                mockExecute.mockReturnValue(dijkstraResult);
                app = createApp();

                const result = await app.execute('graph-id', validBody);

                expect(mockExecute).toHaveBeenCalledWith(
                    mockGraph.graph,
                    'A',
                    'D',
                    COST_SELECTORS.distance,
                    validBody.constraints,
                );
                expect(result.statusCode).toBe(200);
                expect(result.message).toBe('Route optimized successfully');
                expect(result.data).toMatchObject({
                    graphId: 'graph-id',
                    totalCost: 9,
                    path: ['A', 'B', 'D'],
                    preference: 'shortest',
                    constraints: { avoidHighways: false },
                });
                expect(result.data.durationMs).toBeDefined();
                expect(typeof result.data.durationMs).toBe('number');
            });

            it('should return optimized route successfully with fastest preference', async () => {
                const fastestBody = {
                    originNodeId: 'A',
                    destinationNodeId: 'D',
                    preference: 'fastest' as const,
                };
                mockGraphRepository.readById.mockResolvedValue(mockGraph);
                const dijkstraResult: DijkstraResult = {
                    path: ['A', 'C', 'D'],
                    totalCost: 10,
                };
                mockExecute.mockReturnValue(dijkstraResult);
                app = createApp();

                const result = await app.execute('graph-id', fastestBody);

                expect(mockExecute).toHaveBeenCalledWith(
                    mockGraph.graph,
                    'A',
                    'D',
                    COST_SELECTORS.time,
                    undefined,
                );
                expect(result.statusCode).toBe(200);
                expect(result.data.preference).toBe('fastest');
            });

            it('should return not found when no route exists', async () => {
                mockGraphRepository.readById.mockResolvedValue(mockGraph);
                const dijkstraResult: DijkstraResult = {
                    path: [],
                    totalCost: Infinity,
                };
                mockExecute.mockReturnValue(dijkstraResult);
                app = createApp();

                const result = await app.execute('graph-id', validBody);

                expect(result.statusCode).toBe(404);
                expect(result.message).toBe('No route found from A to D');
            });

            it('should use default preference when not provided', async () => {
                const bodyWithoutPreference = {
                    originNodeId: 'A',
                    destinationNodeId: 'D',
                };
                mockGraphRepository.readById.mockResolvedValue(mockGraph);
                const dijkstraResult: DijkstraResult = {
                    path: ['A', 'B', 'D'],
                    totalCost: 9,
                };
                mockExecute.mockReturnValue(dijkstraResult);
                app = createApp();

                const result = await app.execute('graph-id', bodyWithoutPreference);

                expect(mockExecute).toHaveBeenCalledWith(
                    mockGraph.graph,
                    'A',
                    'D',
                    COST_SELECTORS.distance,
                    undefined,
                );
                expect(result.statusCode).toBe(200);
            });

            it('should pass constraints to dijkstra when provided', async () => {
                const bodyWithConstraints = {
                    originNodeId: 'A',
                    destinationNodeId: 'D',
                    preference: 'shortest',
                    constraints: { avoidHighways: true },
                };
                mockGraphRepository.readById.mockResolvedValue(mockGraph);
                const dijkstraResult: DijkstraResult = {
                    path: ['A', 'C', 'D'],
                    totalCost: 10,
                };
                mockExecute.mockReturnValue(dijkstraResult);
                app = createApp();

                await app.execute('graph-id', bodyWithConstraints);

                expect(mockExecute).toHaveBeenCalledWith(
                    mockGraph.graph,
                    'A',
                    'D',
                    COST_SELECTORS.distance,
                    { avoidHighways: true },
                );
            });
        });

        describe('error handling', () => {
            it('should return internal server error when an exception occurs', async () => {
                mockGraphRepository.readById.mockRejectedValue(new Error('Database error'));
                app = createApp();

                const result = await app.execute('graph-id', validBody);

                expect(result.statusCode).toBe(500);
                expect(result.message).toBe('Failed to optimize route');
            });

            it('should log error when exception occurs', async () => {
                const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
                mockGraphRepository.readById.mockRejectedValue(new Error('Database error'));
                app = createApp();

                await app.execute('graph-id', validBody);

                expect(consoleSpy).toHaveBeenCalledWith('Error optimizing route:', expect.any(Error));
                consoleSpy.mockRestore();
            });
        });

        describe('response structure', () => {
            it('should return correct response structure', async () => {
                mockGraphRepository.readById.mockResolvedValue(mockGraph);
                const dijkstraResult: DijkstraResult = {
                    path: ['A', 'B', 'D'],
                    totalCost: 9,
                };
                mockExecute.mockReturnValue(dijkstraResult);
                app = createApp();

                const result = await app.execute('graph-id', validBody);

                expect(result).toHaveProperty('statusCode');
                expect(result).toHaveProperty('message');
                expect(result).toHaveProperty('data');
                expect(result.data).toHaveProperty('graphId');
                expect(result.data).toHaveProperty('totalCost');
                expect(result.data).toHaveProperty('path');
                expect(result.data).toHaveProperty('durationMs');
                expect(result.data).toHaveProperty('preference');
                expect(result.data).toHaveProperty('constraints');
            });
        });
    });
});
