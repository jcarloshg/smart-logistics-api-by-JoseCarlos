/**
 * @jest-environment node
 */
import { describe, it, expect, jest, beforeAll, afterAll } from '@jest/globals';
import { OptimizeRouteApplication } from '@/application/optimize_route/application/optimize_route.application';
import { GraphRepositoryPostgreSQL } from '@/application/shared/infrastructure/postgresql/repositories/GraphRepository.postgresql';
import { GraphType } from '@/application/shared/models/entities/Graph.entity';
import { connectDatabase } from '@/application/shared/infrastructure/postgresql';

describe('OptimizeRouteApplication End2End', () => {
    let app: OptimizeRouteApplication;
    let graphRepository: GraphRepositoryPostgreSQL;

    beforeAll(async () => {
        jest.spyOn(console, 'log').mockImplementation(() => { });
        await connectDatabase();
        graphRepository = new GraphRepositoryPostgreSQL();
    });

    afterAll(async () => {
        jest.restoreAllMocks();
    });

    const validGraph: GraphType = {
        edges: [
            { from: 'A', to: 'B', distance: 4, time: 4, type: 'road' },
            { from: 'A', to: 'C', distance: 2, time: 2, type: 'road' },
            { from: 'B', to: 'C', distance: 1, time: 1, type: 'road' },
            { from: 'B', to: 'D', distance: 5, time: 5, type: 'road' },
            { from: 'C', to: 'D', distance: 8, time: 8, type: 'road' },
        ],
    };

    const validBody = {
        originNodeId: 'A',
        destinationNodeId: 'D',
        preference: 'shortest' as const,
        constraints: { avoidHighways: false },
    };

    describe('execute', () => {
        describe('successful route optimization', () => {
            it('should optimize route successfully and return success response', async () => {
                const created = await graphRepository.create(validGraph);
                const plainCreated = created.get ? created.get({ plain: true }) : created;

                app = new OptimizeRouteApplication(graphRepository);
                const result = await app.execute(plainCreated.id, validBody);

                expect(result.statusCode).toBe(200);
                expect(result.message).toBe('Route optimized successfully');
                expect(result.data).toBeDefined();
                expect(result.data).toHaveProperty('graphId');
                expect(result.data).toHaveProperty('totalCost');
                expect(result.data).toHaveProperty('path');
                expect(result.data).toHaveProperty('durationMs');
                expect(result.data).toHaveProperty('preference');
            });

            it('should optimize route with fastest preference', async () => {
                const created = await graphRepository.create({
                    edges: [
                        { from: 'X', to: 'Y', distance: 10, time: 5, type: 'road' },
                        { from: 'X', to: 'Z', distance: 5, time: 10, type: 'road' },
                        { from: 'Y', to: 'W', distance: 5, time: 10, type: 'road' },
                        { from: 'Z', to: 'W', distance: 10, time: 5, type: 'road' },
                    ],
                });
                const plainCreated = created.get ? created.get({ plain: true }) : created;

                app = new OptimizeRouteApplication(graphRepository);
                const result = await app.execute(plainCreated.id, {
                    originNodeId: 'X',
                    destinationNodeId: 'W',
                    preference: 'fastest',
                });

                expect(result.statusCode).toBe(200);
                expect(result.data).toBeDefined();
                expect(result.data.preference).toBe('fastest');
            });
        });

        describe('validation', () => {
            it('should return bad request when originNodeId is missing', async () => {
                const created = await graphRepository.create(validGraph);
                const plainCreated = created.get ? created.get({ plain: true }) : created;

                app = new OptimizeRouteApplication(graphRepository);
                const result = await app.execute(plainCreated.id, {
                    destinationNodeId: 'D',
                    preference: 'shortest',
                });

                expect(result.statusCode).toBe(400);
                expect(result.message).toBe('Validation failed');
            });

            it('should return bad request when destinationNodeId is missing', async () => {
                const created = await graphRepository.create(validGraph);
                const plainCreated = created.get ? created.get({ plain: true }) : created;

                app = new OptimizeRouteApplication(graphRepository);
                const result = await app.execute(plainCreated.id, {
                    originNodeId: 'A',
                    preference: 'shortest',
                });

                expect(result.statusCode).toBe(400);
                expect(result.message).toBe('Validation failed');
            });
        });

        describe('business rules', () => {
            it('should return bad request when origin and destination are the same', async () => {
                const created = await graphRepository.create(validGraph);
                const plainCreated = created.get ? created.get({ plain: true }) : created;

                app = new OptimizeRouteApplication(graphRepository);
                const result = await app.execute(plainCreated.id, {
                    originNodeId: 'A',
                    destinationNodeId: 'A',
                    preference: 'shortest',
                });

                expect(result.statusCode).toBe(400);
                expect(result.message).toBe('Origin and destination must be different');
            });
        });

        describe('graph not found', () => {
            it('should return not found when graph does not exist', async () => {
                app = new OptimizeRouteApplication(graphRepository);
                const result = await app.execute('00000000-0000-0000-0000-000000000000', validBody);

                expect(result.statusCode).toBe(404);
                expect(result.message).toBe('Graph not found');
            });
        });

        describe('response structure', () => {
            it('should return correct response structure on success', async () => {
                const created = await graphRepository.create(validGraph);
                const plainCreated = created.get ? created.get({ plain: true }) : created;

                app = new OptimizeRouteApplication(graphRepository);
                const result = await app.execute(plainCreated.id, validBody);

                expect(result).toHaveProperty('statusCode');
                expect(result).toHaveProperty('message');
                expect(result).toHaveProperty('data');
                expect(result.statusCode).toBe(200);
            });
        });
    });
});
