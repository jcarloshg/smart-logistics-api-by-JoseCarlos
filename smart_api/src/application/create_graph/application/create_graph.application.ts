import { GraphRepository } from '@/application/shared/models/repositories/Graph.repository';
import { GraphType } from '@/application/shared/models/entities/Graph.entity';

export class CreateGraphApplication {
    private graphRepository: GraphRepository;

    constructor(graphRepository: GraphRepository) {
        this.graphRepository = graphRepository;
    }

    public async execute(graph: GraphType): Promise<CreateGraphAppResponse> {
        const node = await this.graphRepository.create(graph);
        return {
            message: 'Graph created successfully',
            data: node
        };
    }
}




export interface CreateGraphAppResponse {
    message: string;
    data?: any;
}