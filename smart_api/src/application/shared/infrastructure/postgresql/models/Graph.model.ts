import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config';

export interface GraphAttributes {
    id: string;
    graph: any;
    created_at?: Date;
    updated_at?: Date;
}

export interface GraphCreationAttributes extends Optional<GraphAttributes, 'id' | 'created_at' | 'updated_at'> {}

export class Graph extends Model<GraphAttributes, GraphCreationAttributes> implements GraphAttributes {
    public id!: string;
    public graph!: any;
    public created_at?: Date;
    public updated_at?: Date;
}

Graph.init(
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
        modelName: 'Graph',
        tableName: 'graph',
        timestamps: false,
        underscored: true,
    }
);

export default Graph;