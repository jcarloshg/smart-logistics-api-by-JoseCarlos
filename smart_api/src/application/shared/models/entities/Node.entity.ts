import { z } from 'zod';

export const EdgeRawSchema = z.object({
  from: z.string().min(1, 'from node cannot be empty'),
  to: z.string().min(1, 'to node cannot be empty'),
  cost: z.number().positive('cost must be a positive number'),
});

export const NodeRawSchema = z.object({
  edges: z.array(EdgeRawSchema).min(1, 'graph must have at least one edge'),
});

export type EdgeRaw = z.infer<typeof EdgeRawSchema>;
export type NodeRaw = z.infer<typeof NodeRawSchema>;
