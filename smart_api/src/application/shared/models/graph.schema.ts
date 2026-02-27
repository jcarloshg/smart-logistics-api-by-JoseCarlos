import { z } from 'zod';

export const EdgeSchema = z.object({
  from: z.string().min(1, 'from node cannot be empty'),
  to: z.string().min(1, 'to node cannot be empty'),
  cost: z.number().positive('cost must be a positive number'),
});

export const GraphSchema = z.object({
  edges: z.array(EdgeSchema).min(1, 'graph must have at least one edge'),
});

export type Edge = z.infer<typeof EdgeSchema>;
export type Graph = z.infer<typeof GraphSchema>;
