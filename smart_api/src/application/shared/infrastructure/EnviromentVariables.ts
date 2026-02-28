import "dotenv/config";

export type NODE_ENV_VALUE = "development" | "production" | "test";

export interface IENVIROMENT_VARIABLES {
    // Server Configuration
    PORT: string;

    // Node Environment
    NODE_ENV: NODE_ENV_VALUE;

    // CORS Configuration
    ALLOWED_ORIGINS: string;

    //  PostgreSQL Database Configuration
    POSTGRES_DB: string;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_PORT: string;
    POSTGRES_HOST: string;
}

const EnviromentVariables = (): IENVIROMENT_VARIABLES => {
    const envs: IENVIROMENT_VARIABLES = {
        // Server Configuration
        PORT: process.env.PORT ?? "3001",
        // Node Environment
        NODE_ENV: (process.env.NODE_ENV ?? "development") as NODE_ENV_VALUE,
        // CORS Configuration
        ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ?? "http://localhost:3000,http://localhost:3001",
        // PostgreSQL Database Configuration
        POSTGRES_DB: process.env.POSTGRES_DB ?? "points_bd",
        POSTGRES_USER: process.env.POSTGRES_USER ?? "admin",
        POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD ?? "admin123456",
        POSTGRES_PORT: process.env.POSTGRES_PORT ?? "5432",
        POSTGRES_HOST: process.env.POSTGRES_HOST ?? "localhost",
    };

    return envs;
};

export const ENVIROMENT_VARIABLES = EnviromentVariables();
