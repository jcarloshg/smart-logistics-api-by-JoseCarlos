import { GraphType } from '../entities/Graph.entity';

export abstract class GraphRepository {
    abstract create(graph: GraphType): Promise<any>;
    abstract readById(id: string): Promise<any>;
    abstract readAll(): Promise<any[]>;
    abstract update(id: string, graph: Partial<GraphType>): Promise<any>;
    abstract delete(id: string): Promise<boolean>;
    abstract findByEdges(edges: any[]): Promise<any>;
    abstract exists(id: string): Promise<boolean>;
    abstract count(): Promise<number>;
}