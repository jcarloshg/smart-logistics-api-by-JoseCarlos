import swaggerJsdoc from 'swagger-jsdoc';
import 'dotenv/config';

const PORT = process.env.PORT ?? '3001';
const NODE_ENV = process.env.NODE_ENV ?? 'development';

export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Smart Logistics API',
      version: '1.0.0',
      description: 'API for logistics route optimization using Dijkstra\'s algorithm. This API allows you to upload graph data (networks of nodes and edges) and find the optimal route between two nodes.',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
    components: {
      schemas: {
        Node: {
          type: 'object',
          properties: {
            from: { type: 'string', description: 'Source node identifier' },
            to: { type: 'string', description: 'Target node identifier' },
            cost: { type: 'number', description: 'Weight/cost of the edge (e.g., distance, time, or expense)' },
          },
          required: ['from', 'to', 'cost'],
        },
        Graph: {
          type: 'object',
          properties: {
            edges: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Node',
              },
              description: 'Array of edges defining the graph connections',
            },
          },
          required: ['edges'],
          example: {
            edges: [
              { from: 'A', to: 'B', cost: 10 },
              { from: 'B', to: 'C', cost: 15 },
              { from: 'A', to: 'C', cost: 30 },
            ],
          },
        },
        OptimizeRouteRequest: {
          type: 'object',
          properties: {
            originNodeId: { type: 'string', description: 'Starting node identifier' },
            destinationNodeId: { type: 'string', description: 'Destination node identifier' },
          },
          required: ['originNodeId', 'destinationNodeId'],
          example: {
            originNodeId: 'A',
            destinationNodeId: 'C',
          },
        },
        OptimizeRouteResponse: {
          type: 'object',
          properties: {
            graphId: { type: 'string', description: 'Graph identifier' },
            totalCost: { type: 'number', description: 'Total cost of the optimal path' },
            path: {
              type: 'array',
              items: { type: 'string' },
              description: 'Ordered list of node IDs representing the optimal path',
            },
            durationMs: { type: 'number', description: 'Execution time in milliseconds' },
          },
          example: {
            graphId: 'abc123',
            totalCost: 25,
            path: ['A', 'B', 'C'],
            durationMs: 5,
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', description: 'Error message' },
            details: { type: 'string', description: 'Additional error details' },
          },
          example: {
            message: 'Graph not found',
            details: 'No graph exists with the provided ID',
          },
        },
        HealthResponse: {
          type: 'object',
          properties: {
            status: { type: 'string' },
          },
        },
        NodesResponse: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            edges: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  from: { type: 'string' },
                  to: { type: 'string' },
                  cost: { type: 'number' },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/presentation/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
