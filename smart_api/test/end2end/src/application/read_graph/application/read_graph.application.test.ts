/**
 * @jest-environment node
 */
import { describe, it, expect, jest, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { ReadGraphApplication } from '@/application/read_graph/application/read_graph.application';
import { GraphRepositoryPostgreSQL } from '@/application/shared/infrastructure/postgresql/repositories/GraphRepository.postgresql';
import { GraphType } from '@/application/shared/models/entities/Graph.entity';
import { connectDatabase } from '@/application/shared/infrastructure/postgresql';

describe('ReadGraphApplication End2End', () => {
    let app: ReadGraphApplication;
    let graphRepository: GraphRepositoryPostgreSQL;

    beforeAll(async () => {
        await connectDatabase();
        graphRepository = new GraphRepositoryPostgreSQL();
    });

    afterAll(async () => {
        jest.restoreAllMocks();
    });

    beforeEach(async () => {
        app = new ReadGraphApplication(graphRepository);
    });

    const testGraph: GraphType = {
        edges: [
            { from: 'X', to: 'Y', distance: 10, time: 15, type: 'road' },
            { from: 'Y', to: 'Z', distance: 5, time: 8, type: 'highway' },
        ],
    };

    describe('execute', () => {
        describe('successful graph retrieval', () => {
            it('should retrieve graph by id successfully', async () => {
                const created = await graphRepository.create(testGraph);
                const plainCreated = created.get ? created.get({ plain: true }) : created;

                const result = await app.execute(plainCreated.id);

                expect(result.wasSucces).toBe(true);
                expect(result.message).toBe('Graph retrieved successfully');
                expect(result.data).toBeDefined();
                expect(result.data).toHaveProperty('id');
            });
        });

        describe('graph not found', () => {
            it('should return failure when graph does not exist', async () => {
                const result = await app.execute('00000000-0000-0000-0000-000000000000');

                expect(result.wasSucces).toBe(false);
                expect(result.message).toBe('Graph not found');
                expect(result.data).toBeNull();
            });
        });

        describe('response structure', () => {
            it('should return correct response structure on success', async () => {
                const created = await graphRepository.create({
                    edges: [{ from: 'M', to: 'N', distance: 25, time: 30, type: 'road' }]
                });
                const plainCreated = created.get ? created.get({ plain: true }) : created;

                const result = await app.execute(plainCreated.id);

                expect(result).toHaveProperty('wasSucces');
                expect(result).toHaveProperty('message');
                expect(result).toHaveProperty('data');
                expect(result.wasSucces).toBe(true);
                expect(result.message).toBe('Graph retrieved successfully');
                expect(result.data).toBeDefined();
            });

            it('should return correct response structure when not found', async () => {
                const result = await app.execute('00000000-0000-0000-0000-000000000000');

                expect(result).toHaveProperty('wasSucces');
                expect(result).toHaveProperty('message');
                expect(result).toHaveProperty('data');
                expect(result.wasSucces).toBe(false);
                expect(result.data).toBeNull();
            });
        });
    });
});
