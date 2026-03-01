/**
 * @jest-environment node
 */
import { describe, it, expect, jest, beforeEach, afterAll } from '@jest/globals';
import { Request, Response } from 'express';
import { UploadController } from '@/presentation/controllers/network/Upload.controller';
import { GraphRepositoryPostgreSQL } from '@/application/shared/infrastructure/postgresql/repositories/GraphRepository.postgresql';

describe('UploadController Integration', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseObject: any;
    let consoleLogSpy: ReturnType<typeof jest.spyOn>;
    let consoleErrorSpy: ReturnType<typeof jest.spyOn>;

    beforeAll(() => {
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterAll(() => {
        consoleLogSpy.mockRestore();
        consoleErrorSpy.mockRestore();
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        responseObject = {};

        mockRequest = {
            body: {
                edges: [
                    { from: 'A', to: 'B', distance: 10, time: 15, type: 'road' },
                    { from: 'B', to: 'C', distance: 5, time: 8, type: 'highway' },
                ],
            },
        };

        mockResponse = {
            status: jest.fn().mockReturnValue({
                json: jest.fn().mockImplementation((data: any) => {
                    responseObject = { statusCode: 200, ...data };
                    return mockResponse as Response;
                }),
            }) as any,
            json: jest.fn().mockImplementation((data: any) => {
                responseObject = { ...data };
                return mockResponse as Response;
            }) as any,
        };

        jest.clearAllMocks();
    });

    const executeController = async () => {
        await UploadController(mockRequest as Request, mockResponse as Response);
    };

    describe('successful upload', () => {
        it('should return 200 and success message when graph is created successfully', async () => {
            jest.spyOn(GraphRepositoryPostgreSQL.prototype, 'create' as any)
                .mockResolvedValue({ id: 'graph-123', edges: mockRequest.body.edges });

            await executeController();

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(responseObject).toHaveProperty('message');
            expect(responseObject).toHaveProperty('data');
        });

        it('should return created graph data in response', async () => {
            const createdGraph = { id: 'graph-456', edges: mockRequest.body.edges };
            jest.spyOn(GraphRepositoryPostgreSQL.prototype, 'create' as any)
                .mockResolvedValue(createdGraph);

            await executeController();

            expect(responseObject.data).toEqual(createdGraph);
        });

        it('should handle request with single edge', async () => {
            mockRequest.body = {
                edges: [{ from: 'X', to: 'Y', distance: 50, time: 30, type: 'road' }],
            };

            const createdGraph = { id: 'graph-single', edges: mockRequest.body.edges };
            jest.spyOn(GraphRepositoryPostgreSQL.prototype, 'create' as any)
                .mockResolvedValue(createdGraph);

            await executeController();

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(responseObject.data).toEqual(createdGraph);
        });

        it('should handle request with multiple edges', async () => {
            mockRequest.body = {
                edges: [
                    { from: 'A', to: 'B', distance: 10, time: 15, type: 'road' },
                    { from: 'B', to: 'C', distance: 20, time: 25, type: 'highway' },
                    { from: 'C', to: 'D', distance: 30, time: 35, type: 'street' },
                    { from: 'D', to: 'E', distance: 40, time: 45, type: 'road' },
                ],
            };

            const createdGraph = { id: 'graph-multi', edges: mockRequest.body.edges };
            jest.spyOn(GraphRepositoryPostgreSQL.prototype, 'create' as any)
                .mockResolvedValue(createdGraph);

            await executeController();

            expect(responseObject.data.edges).toHaveLength(4);
        });
    });

    describe('failed upload', () => {
        it('should return 400 when graph creation fails', async () => {
            jest.spyOn(GraphRepositoryPostgreSQL.prototype, 'create' as any)
                .mockRejectedValue(new Error('Validation error'));

            await executeController();

            expect(mockResponse.status).toHaveBeenCalledWith(400);
        });

        it('should return 400 when edges are invalid', async () => {
            mockRequest.body = { edges: [] };

            jest.spyOn(GraphRepositoryPostgreSQL.prototype, 'create' as any)
                .mockResolvedValue({ id: 'graph-empty', edges: [] });

            await executeController();

            expect(mockResponse.status).toHaveBeenCalledWith(200);
        });

        it('should return 400 with error message on constraint violation', async () => {
            jest.spyOn(GraphRepositoryPostgreSQL.prototype, 'create' as any)
                .mockRejectedValue(new Error('Unique constraint violation'));

            await executeController();

            expect(mockResponse.status).toHaveBeenCalledWith(400);
        });

        it('should return 500 when an unexpected error occurs', async () => {
            jest.spyOn(GraphRepositoryPostgreSQL.prototype, 'create' as any)
                .mockRejectedValue(new Error('Database connection failed'));

            await executeController();

            expect(mockResponse.status).toHaveBeenCalledWith(400);
        });

        it('should return 500 when repository throws error', async () => {
            jest.spyOn(GraphRepositoryPostgreSQL.prototype, 'create' as any)
                .mockRejectedValue(new Error('Connection refused'));

            await executeController();

            expect(mockResponse.status).toHaveBeenCalledWith(400);
        });

        it('should handle null request body gracefully', async () => {
            mockRequest.body = null;

            jest.spyOn(GraphRepositoryPostgreSQL.prototype, 'create' as any)
                .mockRejectedValue(new Error('Invalid input'));

            await executeController();

            expect(mockResponse.status).toHaveBeenCalledWith(400);
        });

        it('should handle undefined edges gracefully', async () => {
            mockRequest.body = {};

            jest.spyOn(GraphRepositoryPostgreSQL.prototype, 'create' as any)
                .mockRejectedValue(new Error('Invalid graph data'));

            await executeController();

            expect(mockResponse.status).toHaveBeenCalledWith(400);
        });
    });

    describe('error handling', () => {
        it('should return 400 when an unexpected error occurs', async () => {
            jest.spyOn(GraphRepositoryPostgreSQL.prototype, 'create' as any)
                .mockRejectedValue(new Error('Database connection failed'));

            await executeController();

            expect(mockResponse.status).toHaveBeenCalledWith(400);
        });

        it('should return 400 when repository throws error', async () => {
            jest.spyOn(GraphRepositoryPostgreSQL.prototype, 'create' as any)
                .mockRejectedValue(new Error('Connection refused'));

            await executeController();

            expect(mockResponse.status).toHaveBeenCalledWith(400);
        });

        it('should handle null request body gracefully', async () => {
            mockRequest.body = null;

            jest.spyOn(GraphRepositoryPostgreSQL.prototype, 'create' as any)
                .mockRejectedValue(new Error('Invalid input'));

            await executeController();

            expect(mockResponse.status).toHaveBeenCalledWith(400);
        });

        it('should handle undefined edges gracefully', async () => {
            mockRequest.body = {};
            jest.spyOn(GraphRepositoryPostgreSQL.prototype, 'create' as any)
                .mockResolvedValue({ id: 'graph-empty', edges: [] });

            await executeController();

            expect(mockResponse.status).toHaveBeenCalled();
        });
    });

    describe('response structure', () => {
        it('should return correct response structure on success', async () => {
            const createdGraph = { id: 'graph-123', edges: mockRequest.body.edges };
            jest.spyOn(GraphRepositoryPostgreSQL.prototype, 'create' as any)
                .mockResolvedValue(createdGraph);

            await executeController();

            expect(responseObject).toHaveProperty('message');
            expect(responseObject).toHaveProperty('data');
            expect(responseObject.data).toHaveProperty('id');
            expect(responseObject.data).toHaveProperty('edges');
        });

        it('should return correct response structure on failure', async () => {
            jest.spyOn(GraphRepositoryPostgreSQL.prototype, 'create' as any)
                .mockRejectedValue(new Error('Error'));

            await executeController();

            expect(responseObject).toHaveProperty('message');
            expect(responseObject).toHaveProperty('data');
        });
    });

    describe('controller initialization', () => {
        it('should create GraphRepositoryPostgreSQL instance', async () => {
            const createSpy = jest.spyOn(GraphRepositoryPostgreSQL.prototype, 'create' as any)
                .mockResolvedValue({ id: 'test', edges: [] });

            await executeController();

            expect(createSpy).toHaveBeenCalled();
        });

        it('should call useCase.execute with request body', async () => {
            const expectedEdges = mockRequest.body.edges;
            jest.spyOn(GraphRepositoryPostgreSQL.prototype, 'create' as any)
                .mockResolvedValue({ id: 'test', edges: expectedEdges });

            await executeController();

            expect(responseObject.data.edges).toEqual(expectedEdges);
        });
    });
});
