import { GraphRepository } from '@/application/shared/models/repositories/Graph.repository';

export class ReadGraphApplication {
    private graphRepository: GraphRepository;

    constructor(graphRepository: GraphRepository) {
        this.graphRepository = graphRepository;
    }

    public async execute(graphId: string): Promise<ReadGraphAppResponse> {
        try {
            console.log(`Fetching graph with id: ${graphId}`);
            const graph = await this.graphRepository.readById(graphId);

            if (!graph) {
                return {
                    wasSucces: false,
                    message: 'Graph not found',
                    data: null
                };
            }

            return {
                wasSucces: true,
                message: 'Graph retrieved successfully',
                data: graph
            };
        } catch (error) {
            console.error('Error reading graph:', error);
            return {
                wasSucces: false,
                message: 'Failed to read graph',
                data: null
            };
        }
    }
}

export interface ReadGraphAppResponse {
    wasSucces: boolean;
    message: string;
    data?: any;
}