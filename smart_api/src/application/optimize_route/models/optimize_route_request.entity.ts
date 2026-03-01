import { z } from 'zod';

export const OptimizeRouteSchema = z.object({
    originNodeId: z.string().min(1, 'originNodeId is required'),
    destinationNodeId: z.string().min(1, 'destinationNodeId is required'),
});

export type OptimizeRouteRequest = z.infer<typeof OptimizeRouteSchema>;
