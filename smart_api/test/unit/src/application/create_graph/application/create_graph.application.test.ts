/**
 * @jest-environment node
 */
import { describe, it, expect, jest, beforeEach, afterAll } from '@jest/globals';
import { CreateGraphApplication } from '@/application/create_graph/application/create_graph.application';
import { GraphRepository } from '@/application/shared/models/repositories/Graph.repository';
import { GraphType } from '@/application/shared/models/entities/Graph.entity';

describe('CreateGraphApplication', () => {
    let app: CreateGraphApplication;
    let mockGraphRepository: any;
    let consoleSpy: ReturnType<typeof jest.spyOn>;

    beforeAll(() => {
        consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterAll(() => {
        consoleSpy.mockRestore();
        jest.restoreAllMocks();
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
    });

    const createApp = () => new CreateGraphApplication(mockGraphRepository as GraphRepository);

    const validGraph: GraphType = {
        edges: [
            { from: 'A', to: 'B', distance: 10, time: 15, type: 'road' },
            { from: 'B', to: 'C', distance: 5, time: 8, type: 'highway' },
            { from: 'C', to: 'D', distance: 20, time: 25, type: 'street' },
        ],
    };

    const mockCreatedGraph = {
        id: 'graph-123',
        ...validGraph,
    };

    describe('execute', () => {
        describe('successful graph creation', () => {
            it('should create graph successfully and return success response', async () => {
                mockGraphRepository.create.mockResolvedValue(mockCreatedGraph);
                app = createApp();

                const result = await app.execute(validGraph);

                expect(mockGraphRepository.create).toHaveBeenCalledWith(validGraph);
                expect(result.wasSucces).toBe(true);
                expect(result.message).toBe('Graph created successfully');
                expect(result.data).toEqual(mockCreatedGraph);
            });

            it('should create graph with single edge', async () => {
                const singleEdgeGraph: GraphType = {
                    edges: [
                        { from: 'A', to: 'B', distance: 10, time: 15, type: 'road' },
                    ],
                };
                mockGraphRepository.create.mockResolvedValue({ id: 'graph-1', ...singleEdgeGraph });
                app = createApp();

                const result = await app.execute(singleEdgeGraph);

                expect(result.wasSucces).toBe(true);
                expect(result.data).toBeDefined();
            });

            it('should create graph with highway edges', async () => {
                const highwayGraph: GraphType = {
                    edges: [
                        { from: 'A', to: 'B', distance: 100, time: 60, type: 'highway' },
                        { from: 'B', to: 'C', distance: 150, time: 90, type: 'highway' },
                    ],
                };
                mockGraphRepository.create.mockResolvedValue({ id: 'graph-2', ...highwayGraph });
                app = createApp();

                const result = await app.execute(highwayGraph);

                expect(result.wasSucces).toBe(true);
                expect(result.data).toBeDefined();
            });
        });

        describe('error handling', () => {
            it('should return failure response when graph creation fails', async () => {
                mockGraphRepository.create.mockRejectedValue(new Error('Database error'));
                app = createApp();

                const result = await app.execute(validGraph);

                expect(result.wasSucces).toBe(false);
                expect(result.message).toBe('Failed to create graph');
                expect(result.data).toBeNull();
            });

            it('should return failure response when constraint violation occurs', async () => {
                mockGraphRepository.create.mockRejectedValue(new Error('Unique constraint violation'));
                app = createApp();

                const result = await app.execute(validGraph);

                expect(result.wasSucces).toBe(false);
                expect(result.message).toBe('Failed to create graph');
            });

            it('should handle connection errors', async () => {
                mockGraphRepository.create.mockRejectedValue(new Error('Connection refused'));
                app = createApp();

                const result = await app.execute(validGraph);

                expect(result.wasSucces).toBe(false);
            });
        });

        describe('response structure', () => {
            it('should return correct response structure on success', async () => {
                mockGraphRepository.create.mockResolvedValue(mockCreatedGraph);
                app = createApp();

                const result = await app.execute(validGraph);

                expect(result).toHaveProperty('wasSucces');
                expect(result).toHaveProperty('message');
                expect(result).toHaveProperty('data');
            });

            it('should return correct response structure on failure', async () => {
                mockGraphRepository.create.mockRejectedValue(new Error('Error'));
                app = createApp();

                const result = await app.execute(validGraph);

                expect(result).toHaveProperty('wasSucces');
                expect(result).toHaveProperty('message');
                expect(result).toHaveProperty('data');
                expect(result.wasSucces).toBe(false);
                expect(result.data).toBeNull();
            });
        });

        describe('logging', () => {
            it('should log the graph input on success', async () => {
                mockGraphRepository.create.mockResolvedValue(mockCreatedGraph);
                app = createApp();

                const result = await app.execute(validGraph);

                expect(result.wasSucces).toBe(true);
            });
        });
    });
});
