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
      description: `
## Overview
API for logistics route optimization using Dijkstra's algorithm. This API allows you to upload graph data (networks of nodes and edges) and find the optimal route between two nodes.

## Features
- **Graph Management**: Upload and store graph data (nodes and weighted edges)
- **Route Optimization**: Find shortest or fastest path between two nodes
- **Constraints**: Option to avoid highways in route calculation
- **Performance Metrics**: Returns execution time for route calculations

## Authentication
Currently, this API does not require authentication.

## Rate Limiting
Currently, no rate limiting is applied.
      `,
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
    tags: [
      { name: 'Network', description: 'Graph management endpoints' },
      { name: 'Route', description: 'Route optimization endpoints' },
      { name: 'Health', description: 'Health check endpoints' },
    ],
    components: {
      schemas: {
        Node: {
          type: 'object',
          properties: {
            from: { 
              type: 'string', 
              description: 'Source node identifier',
              example: 'A',
            },
            to: { 
              type: 'string', 
              description: 'Target node identifier',
              example: 'B',
            },
            distance: { 
              type: 'number', 
              description: 'Distance/weight of the edge (positive number)',
              example: 10,
            },
            time: { 
              type: 'number', 
              description: 'Time/cost to traverse the edge (positive number)',
              example: 15,
            },
            type: { 
              type: 'string', 
              enum: ['highway', 'road', 'street'],
              description: 'Type of road/edge',
              example: 'road',
            },
          },
          required: ['from', 'to', 'distance', 'time'],
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
              { from: 'A', to: 'B', distance: 4, time: 5, type: 'road' },
              { from: 'B', to: 'C', distance: 3, time: 4, type: 'highway' },
              { from: 'C', to: 'D', distance: 5, time: 8, type: 'street' },
            ],
          },
        },
        Constraints: {
          type: 'object',
          properties: {
            avoidHighways: {
              type: 'boolean',
              description: 'Whether to avoid highway edges in route calculation',
              default: false,
              example: true,
            },
          },
        },
        OptimizeRouteRequest: {
          type: 'object',
          properties: {
            originNodeId: { 
              type: 'string', 
              description: 'Starting node identifier',
              example: 'A',
            },
            destinationNodeId: { 
              type: 'string', 
              description: 'Destination node identifier',
              example: 'D',
            },
            preference: { 
              type: 'string', 
              enum: ['shortest', 'fastest'],
              description: 'Optimization preference: shortest (by distance) or fastest (by time)',
              default: 'shortest',
              example: 'shortest',
            },
            constraints: {
              $ref: '#/components/schemas/Constraints',
            },
          },
          required: ['originNodeId', 'destinationNodeId'],
          example: {
            originNodeId: 'A',
            destinationNodeId: 'D',
            preference: 'shortest',
            constraints: {
              avoidHighways: false,
            },
          },
        },
        OptimizeRouteResponse: {
          type: 'object',
          properties: {
            graphId: { 
              type: 'string', 
              description: 'Graph identifier',
              example: 'abc123',
            },
            totalCost: { 
              type: 'number', 
              description: 'Total cost (distance or time) of the optimal path',
              example: 12,
            },
            path: {
              type: 'array',
              items: { type: 'string' },
              description: 'Ordered list of node IDs representing the optimal path',
              example: ['A', 'B', 'D'],
            },
            durationMs: { 
              type: 'number', 
              description: 'Execution time in milliseconds',
              example: 5,
            },
            preference: {
              type: 'string',
              enum: ['shortest', 'fastest'],
              description: 'The preference used for optimization',
              example: 'shortest',
            },
            constraints: {
              $ref: '#/components/schemas/Constraints',
            },
          },
          example: {
            graphId: 'abc123',
            totalCost: 12,
            path: ['A', 'B', 'D'],
            durationMs: 5,
            preference: 'shortest',
            constraints: {
              avoidHighways: false,
            },
          },
        },
        CreateGraphResponse: {
          type: 'object',
          properties: {
            wasSucces: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                edges: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Node' },
                },
              },
            },
          },
          example: {
            wasSucces: true,
            message: 'Graph created successfully',
            data: {
              id: 'abc123',
              edges: [
                { from: 'A', to: 'B', distance: 10, time: 15, type: 'road' },
              ],
            },
          },
        },
        ReadGraphResponse: {
          type: 'object',
          properties: {
            wasSucces: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                edges: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Node' },
                },
              },
            },
          },
          example: {
            wasSucces: true,
            message: 'Graph retrieved successfully',
            data: {
              id: 'abc123',
              edges: [
                { from: 'A', to: 'B', distance: 10, time: 15, type: 'road' },
                { from: 'B', to: 'C', distance: 5, time: 8, type: 'highway' },
              ],
            },
          },
        },
        HealthResponse: {
          type: 'object',
          properties: {
            status: { type: 'string' },
          },
          example: {
            status: 'ok',
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', description: 'Error message' },
            data: { type: 'object', description: 'Additional error details or null' },
          },
          example: {
            message: 'Graph not found',
            data: null,
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' },
                },
              },
            },
          },
          example: {
            message: 'Validation failed',
            data: [
              { field: 'originNodeId', message: 'originNodeId is required' },
            ],
          },
        },
      },
    },
  },
  apis: ['./src/presentation/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
