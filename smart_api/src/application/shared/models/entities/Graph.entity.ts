import { z } from 'zod';

export const NodeSchema = z.object({
  from: z.string().min(1, 'from node cannot be empty'),
  to: z.string().min(1, 'to node cannot be empty'),
  distance: z.number().positive('distance must be a positive number'),
  time: z.number().positive('time must be a positive number'),
  type: z.enum(['highway', 'road', 'street']).optional().default('road'),
});

export const GraphSchema = z.object({
  edges: z.array(NodeSchema).min(1, 'graph must have at least one edge'),
});

export type NodeType = z.infer<typeof NodeSchema>;
export type GraphType = z.infer<typeof GraphSchema>;
