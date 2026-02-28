import { GraphRepository } from '@/application/shared/models/repositories/Graph.repository';
import { GraphType } from '@/application/shared/models/entities/Graph.entity';

export class CreateGraphApplication {
    private graphRepository: GraphRepository;

    constructor(graphRepository: GraphRepository) {
        this.graphRepository = graphRepository;
    }

    public async execute(graph: GraphType): Promise<CreateGraphAppResponse> {
        try {
            console.log(`graph: `, graph);
            const node = await this.graphRepository.create(graph);
            return {
                wasSucces: true,
                message: 'Graph created successfully',
                data: node
            };
        } catch (error) {
            console.error('Error creating graph:', error);
            return {
                wasSucces: false,
                message: 'Failed to create graph',
                data: null
            };
        }
    }
}




export interface CreateGraphAppResponse {
    wasSucces: boolean;
    message: string;
    data?: any;
}