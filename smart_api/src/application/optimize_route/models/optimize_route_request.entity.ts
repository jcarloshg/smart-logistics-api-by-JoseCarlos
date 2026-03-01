import { z } from 'zod';

export const ConstraintsSchema = z.object({
    avoidHighways: z.boolean().optional().default(false),
});

export const OptimizeRouteSchema = z.object({
    originNodeId: z.string().min(1, 'originNodeId is required'),
    destinationNodeId: z.string().min(1, 'destinationNodeId is required'),
    preference: z.enum(['shortest', 'fastest']).default('shortest'),
    constraints: ConstraintsSchema.optional(),
});

export type OptimizeRouteRequest = z.infer<typeof OptimizeRouteSchema>;
export type Preference = 'shortest' | 'fastest';
export type RouteConstraints = z.infer<typeof ConstraintsSchema>;
