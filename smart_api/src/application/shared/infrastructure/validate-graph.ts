import { GraphSchema } from '../models/graph.schema';
import { ZodError } from 'zod';

export function validateGraph(data: unknown) {
  try {
    return {
      success: true,
      data: GraphSchema.parse(data),
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        errors: error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      };
    }
    throw error;
  }
}
