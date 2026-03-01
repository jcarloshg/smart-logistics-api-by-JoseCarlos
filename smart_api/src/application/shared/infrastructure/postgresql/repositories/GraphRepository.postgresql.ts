import { GraphRepository } from '@/application/shared/models/repositories/Graph.repository';
import { GraphType } from '@/application/shared/models/entities/Graph.entity';
import GraphModel from '../models/Graph.model';

export class GraphRepositoryPostgreSQL extends GraphRepository {

    constructor() {
        super();
        console.log(`init: GraphRepositoryPostgreSQL`);
    }

    async create(graph: GraphType): Promise<any> {
        return await GraphModel.create({
            graph: graph
        });
    }

    async readById(id: string): Promise<any> {
        const graph = await GraphModel.findByPk(id);
        return graph ? graph.get({ plain: true }) : null;
    }

    async readAll(): Promise<any[]> {
        return await GraphModel.findAll();
    }

    async update(id: string, graph: Partial<GraphType>): Promise<any> {
        await GraphModel.update({ graph }, { where: { id } });
        return await GraphModel.findByPk(id);
    }

    async delete(id: string): Promise<boolean> {
        const result = await GraphModel.destroy({ where: { id } });
        return result > 0;
    }

    async findByEdges(edges: any[]): Promise<any> {
        return await GraphModel.findOne({
            where: { graph: { edges } }
        });
    }

    async exists(id: string): Promise<boolean> {
        const graph = await GraphModel.findByPk(id);
        return graph !== null;
    }

    async count(): Promise<number> {
        return await GraphModel.count();
    }
}