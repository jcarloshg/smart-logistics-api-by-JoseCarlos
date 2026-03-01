/**
 * @jest-environment node
 */
import { describe, it, expect, jest, beforeEach, afterAll } from '@jest/globals';
import { CreateGraphApplication } from '@/application/create_graph/application/create_graph.application';
import { GraphRepositoryPostgreSQL } from '@/application/shared/infrastructure/postgresql/repositories/GraphRepository.postgresql';
import { GraphType } from '@/application/shared/models/entities/Graph.entity';

describe('CreateGraphApplication End2End', () => {
    let app: CreateGraphApplication;
    let graphRepository: GraphRepositoryPostgreSQL;
    let consoleSpy: ReturnType<typeof jest.spyOn>;

    beforeAll(async () => {
        consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        jest.spyOn(console, 'log').mockImplementation(() => { });
        graphRepository = new GraphRepositoryPostgreSQL();
    });

    afterAll(async () => {
        consoleSpy.mockRestore();
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        app = new CreateGraphApplication(graphRepository);
    });

    const validGraph: GraphType = {
        edges: [
            { from: 'A', to: 'B', distance: 10, time: 15, type: 'road' },
            { from: 'B', to: 'C', distance: 5, time: 8, type: 'highway' },
            { from: 'C', to: 'D', distance: 20, time: 25, type: 'street' },
        ],
    };

    describe('execute', () => {
        describe('successful graph creation', () => {
            it('should create graph successfully and return success response', async () => {
                const result = await app.execute(validGraph);

                expect(result.wasSucces).toBe(true);
                expect(result.message).toBe('Graph created successfully');
                expect(result.data).toBeDefined();
                expect(result.data).toHaveProperty('id');
            });

            it('should create graph with single edge', async () => {
                const singleEdgeGraph: GraphType = {
                    edges: [
                        { from: 'X', to: 'Y', distance: 10, time: 15, type: 'road' },
                    ],
                };

                const result = await app.execute(singleEdgeGraph);

                expect(result.wasSucces).toBe(true);
                expect(result.data).toBeDefined();
            });

            it('should create graph with highway edges', async () => {
                const highwayGraph: GraphType = {
                    edges: [
                        { from: 'P', to: 'Q', distance: 100, time: 60, type: 'highway' },
                        { from: 'Q', to: 'R', distance: 150, time: 90, type: 'highway' },
                    ],
                };

                const result = await app.execute(highwayGraph);

                expect(result.wasSucces).toBe(true);
                expect(result.data).toBeDefined();
            });
        });

        describe('response structure', () => {
            it('should return correct response structure on success', async () => {
                const testGraph: GraphType = {
                    edges: [
                        { from: 'M', to: 'N', distance: 25, time: 30, type: 'road' },
                    ],
                };

                const result = await app.execute(testGraph);

                expect(result).toHaveProperty('wasSucces');
                expect(result).toHaveProperty('message');
                expect(result).toHaveProperty('data');
                expect(result.wasSucces).toBe(true);
                expect(result.message).toBe('Graph created successfully');
                expect(result.data).toBeDefined();
            });
        });
    });
});
