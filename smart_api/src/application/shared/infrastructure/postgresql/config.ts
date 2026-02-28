import { Sequelize } from 'sequelize';
import { ENVIROMENT_VARIABLES } from '../EnviromentVariables';

export const sequelize = new Sequelize({
    dialect: 'postgres',
    host: ENVIROMENT_VARIABLES.POSTGRES_HOST,
    port: parseInt(ENVIROMENT_VARIABLES.POSTGRES_PORT),
    username: ENVIROMENT_VARIABLES.POSTGRES_USER,
    password: ENVIROMENT_VARIABLES.POSTGRES_PASSWORD,
    database: ENVIROMENT_VARIABLES.POSTGRES_DB,
    logging: false,
});

export const connectDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

export const disconnectDatabase = async () => {
    await sequelize.close();
};