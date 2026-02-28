import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config';

export interface NodeAttributes {
    id: string;
    graph: any;
    created_at?: Date;
    updated_at?: Date;
}

export interface NodeCreationAttributes extends Optional<NodeAttributes, 'id' | 'created_at' | 'updated_at'> {}

export class Node extends Model<NodeAttributes, NodeCreationAttributes> implements NodeAttributes {
    public id!: string;
    public graph!: any;
    public created_at?: Date;
    public updated_at?: Date;
}

Node.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        graph: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        modelName: 'node',
        tableName: 'node',
        timestamps: false,
    }
);

export default Node;