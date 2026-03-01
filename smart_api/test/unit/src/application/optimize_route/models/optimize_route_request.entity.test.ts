/**
 * @jest-environment node
 */
import { describe, it, expect } from '@jest/globals';
import { OptimizeRouteSchema, ConstraintsSchema, OptimizeRouteRequest, Preference, RouteConstraints } from '@/application/optimize_route/models/optimize_route_request.entity';

describe('OptimizeRouteRequest Entity', () => {
    describe('OptimizeRouteSchema', () => {
        it('should parse valid request with all fields', () => {
            const validRequest = {
                originNodeId: 'node1',
                destinationNodeId: 'node2',
                preference: 'shortest',
                constraints: {
                    avoidHighways: true,
                },
            };

            const result = OptimizeRouteSchema.safeParse(validRequest);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toEqual(validRequest);
            }
        });

        it('should parse valid request with only required fields', () => {
            const validRequest = {
                originNodeId: 'node1',
                destinationNodeId: 'node2',
            };

            const result = OptimizeRouteSchema.safeParse(validRequest);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.originNodeId).toBe('node1');
                expect(result.data.destinationNodeId).toBe('node2');
                expect(result.data.preference).toBe('shortest');
                expect(result.data.constraints).toBeUndefined();
            }
        });

        it('should use default preference when not provided', () => {
            const request = {
                originNodeId: 'node1',
                destinationNodeId: 'node2',
            };

            const result = OptimizeRouteSchema.safeParse(request);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.preference).toBe('shortest');
            }
        });

        it('should accept fastest preference', () => {
            const request = {
                originNodeId: 'node1',
                destinationNodeId: 'node2',
                preference: 'fastest',
            };

            const result = OptimizeRouteSchema.safeParse(request);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.preference).toBe('fastest');
            }
        });

        it('should reject empty originNodeId', () => {
            const invalidRequest = {
                originNodeId: '',
                destinationNodeId: 'node2',
            };

            const result = OptimizeRouteSchema.safeParse(invalidRequest);

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].path).toContain('originNodeId');
            }
        });

        it('should reject empty destinationNodeId', () => {
            const invalidRequest = {
                originNodeId: 'node1',
                destinationNodeId: '',
            };

            const result = OptimizeRouteSchema.safeParse(invalidRequest);

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].path).toContain('destinationNodeId');
            }
        });

        it('should reject invalid preference value', () => {
            const invalidRequest = {
                originNodeId: 'node1',
                destinationNodeId: 'node2',
                preference: 'invalid',
            };

            const result = OptimizeRouteSchema.safeParse(invalidRequest);

            expect(result.success).toBe(false);
        });

        it('should parse valid constraints with avoidHighways false', () => {
            const request = {
                originNodeId: 'node1',
                destinationNodeId: 'node2',
                constraints: {
                    avoidHighways: false,
                },
            };

            const result = OptimizeRouteSchema.safeParse(request);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.constraints?.avoidHighways).toBe(false);
            }
        });

        it('should use default value for constraints.avoidHighways', () => {
            const request = {
                originNodeId: 'node1',
                destinationNodeId: 'node2',
                constraints: {},
            };

            const result = OptimizeRouteSchema.safeParse(request);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.constraints?.avoidHighways).toBe(false);
            }
        });
    });

    describe('ConstraintsSchema', () => {
        it('should parse valid constraints', () => {
            const constraints = { avoidHighways: true };

            const result = ConstraintsSchema.safeParse(constraints);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.avoidHighways).toBe(true);
            }
        });

        it('should use default avoidHighways value', () => {
            const constraints = {};

            const result = ConstraintsSchema.safeParse(constraints);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.avoidHighways).toBe(false);
            }
        });

        it('should reject non-boolean avoidHighways', () => {
            const constraints = { avoidHighways: 'true' };

            const result = ConstraintsSchema.safeParse(constraints);

            expect(result.success).toBe(false);
        });
    });

    describe('Type inference', () => {
        it('should infer OptimizeRouteRequest type correctly', () => {
            const request: OptimizeRouteRequest = {
                originNodeId: 'origin',
                destinationNodeId: 'destination',
                preference: 'fastest',
                constraints: {
                    avoidHighways: true,
                },
            };

            expect(request.originNodeId).toBe('origin');
            expect(request.destinationNodeId).toBe('destination');
            expect(request.preference).toBe('fastest');
            expect(request.constraints?.avoidHighways).toBe(true);
        });

        it('should accept Preference type values', () => {
            const shortest: Preference = 'shortest';
            const fastest: Preference = 'fastest';

            expect(shortest).toBe('shortest');
            expect(fastest).toBe('fastest');
        });

        it('should accept RouteConstraints type values', () => {
            const constraints: RouteConstraints = {
                avoidHighways: true,
            };

            expect(constraints.avoidHighways).toBe(true);
        });
    });
});
