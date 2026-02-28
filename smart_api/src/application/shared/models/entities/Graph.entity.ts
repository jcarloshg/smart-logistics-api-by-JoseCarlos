import { z } from 'zod';

export const NodeSchema = z.object({
  from: z.string().min(1, 'from node cannot be empty'),
  to: z.string().min(1, 'to node cannot be empty'),
  cost: z.number().positive('cost must be a positive number'),
});

export const GraphSchema = z.object({
  edges: z.array(NodeSchema).min(1, 'graph must have at least one edge'),
});

export type NodeType = z.infer<typeof NodeSchema>;
export type GraphType = z.infer<typeof GraphSchema>;
