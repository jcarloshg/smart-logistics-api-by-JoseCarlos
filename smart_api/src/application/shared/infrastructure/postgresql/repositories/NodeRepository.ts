import Node, { NodeAttributes, NodeCreationAttributes } from '../models/Node.model';

export class NodeRepository {
    async create(data: NodeCreationAttributes): Promise<Node> {
        return await Node.create(data);
    }

    async findById(id: string): Promise<Node | null> {
        return await Node.findByPk(id);
    }

    async findAll(): Promise<Node[]> {
        return await Node.findAll();
    }

    async update(id: string, data: Partial<NodeAttributes>): Promise<[number, Node[]]> {
        return await Node.update(data, {
            where: { id },
            returning: true,
        });
    }

    async delete(id: string): Promise<number> {
        return await Node.destroy({
            where: { id },
        });
    }

    async findByGraph(graph: any): Promise<Node | null> {
        return await Node.findOne({
            where: { graph },
        });
    }
}

export const nodeRepository = new NodeRepository();