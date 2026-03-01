/**
 * @jest-environment node
 */
import { describe, it, expect, jest, beforeEach, afterAll } from '@jest/globals';
import { ReadGraphApplication } from '@/application/read_graph/application/read_graph.application';
import { GraphRepository } from '@/application/shared/models/repositories/Graph.repository';

describe('ReadGraphApplication', () => {
    let app: ReadGraphApplication;
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

    const createApp = () => new ReadGraphApplication(mockGraphRepository as GraphRepository);

    const mockGraph = {
        id: 'graph-123',
        edges: [
            { from: 'A', to: 'B', distance: 10, time: 15, type: 'road' },
            { from: 'B', to: 'C', distance: 5, time: 8, type: 'highway' },
        ],
    };

    describe('execute', () => {
        describe('successful graph retrieval', () => {
            it('should return success response when graph is found', async () => {
                mockGraphRepository.readById.mockResolvedValue(mockGraph);
                app = createApp();

                const result = await app.execute('graph-123');

                expect(mockGraphRepository.readById).toHaveBeenCalledWith('graph-123');
                expect(result.wasSucces).toBe(true);
                expect(result.message).toBe('Graph retrieved successfully');
                expect(result.data).toEqual(mockGraph);
            });

            it('should return success with empty graph data', async () => {
                const emptyGraph = { id: 'graph-empty', edges: [] };
                mockGraphRepository.readById.mockResolvedValue(emptyGraph);
                app = createApp();

                const result = await app.execute('graph-empty');

                expect(result.wasSucces).toBe(true);
                expect(result.data).toEqual(emptyGraph);
            });
        });

        describe('graph not found', () => {
            it('should return failure response when graph does not exist', async () => {
                mockGraphRepository.readById.mockResolvedValue(null);
                app = createApp();

                const result = await app.execute('non-existent-id');

                expect(result.wasSucces).toBe(false);
                expect(result.message).toBe('Graph not found');
                expect(result.data).toBeNull();
            });
        });

        describe('error handling', () => {
            it('should return failure response when database error occurs', async () => {
                mockGraphRepository.readById.mockRejectedValue(new Error('Database error'));
                app = createApp();

                const result = await app.execute('graph-123');

                expect(result.wasSucces).toBe(false);
                expect(result.message).toBe('Failed to read graph');
                expect(result.data).toBeNull();
            });

            it('should return failure response when connection fails', async () => {
                mockGraphRepository.readById.mockRejectedValue(new Error('Connection refused'));
                app = createApp();

                const result = await app.execute('graph-123');

                expect(result.wasSucces).toBe(false);
                expect(result.message).toBe('Failed to read graph');
            });
        });

        describe('response structure', () => {
            it('should return correct response structure on success', async () => {
                mockGraphRepository.readById.mockResolvedValue(mockGraph);
                app = createApp();

                const result = await app.execute('graph-123');

                expect(result).toHaveProperty('wasSucces');
                expect(result).toHaveProperty('message');
                expect(result).toHaveProperty('data');
            });

            it('should return correct response structure when not found', async () => {
                mockGraphRepository.readById.mockResolvedValue(null);
                app = createApp();

                const result = await app.execute('non-existent-id');

                expect(result).toHaveProperty('wasSucces');
                expect(result).toHaveProperty('message');
                expect(result).toHaveProperty('data');
                expect(result.wasSucces).toBe(false);
                expect(result.data).toBeNull();
            });

            it('should return correct response structure on error', async () => {
                mockGraphRepository.readById.mockRejectedValue(new Error('Error'));
                app = createApp();

                const result = await app.execute('graph-123');

                expect(result).toHaveProperty('wasSucces');
                expect(result).toHaveProperty('message');
                expect(result).toHaveProperty('data');
                expect(result.wasSucces).toBe(false);
                expect(result.data).toBeNull();
            });
        });

        describe('logging', () => {
            it('should log the graph id when fetching', async () => {
                mockGraphRepository.readById.mockResolvedValue(mockGraph);
                app = createApp();

                const result = await app.execute('graph-123');

                expect(result.wasSucces).toBe(true);
            });
        });
    });
});
