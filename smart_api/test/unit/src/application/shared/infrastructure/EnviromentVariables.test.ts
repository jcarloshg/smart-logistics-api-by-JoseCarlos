/**
 * @jest-environment node
 */
import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';

describe('EnviromentVariables', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...originalEnv };
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    describe('default values', () => {
        it('should return default PORT when not set', () => {
            delete process.env.PORT;
            const { ENVIROMENT_VARIABLES } = require('@/application/shared/infrastructure/EnviromentVariables');
            expect(ENVIROMENT_VARIABLES.PORT).toBe('3001');
        });

        it('should return default NODE_ENV when not set', () => {
            delete process.env.NODE_ENV;
            const { ENVIROMENT_VARIABLES } = require('@/application/shared/infrastructure/EnviromentVariables');
            expect(ENVIROMENT_VARIABLES.NODE_ENV).toBe('development');
        });

        it('should return default ALLOWED_ORIGINS when not set', () => {
            delete process.env.ALLOWED_ORIGINS;
            const { ENVIROMENT_VARIABLES } = require('@/application/shared/infrastructure/EnviromentVariables');
            expect(ENVIROMENT_VARIABLES.ALLOWED_ORIGINS).toBe('http://localhost:3000,http://localhost:3001');
        });

        it('should return default POSTGRES_DB when not set', () => {
            delete process.env.POSTGRES_DB;
            const { ENVIROMENT_VARIABLES } = require('@/application/shared/infrastructure/EnviromentVariables');
            expect(ENVIROMENT_VARIABLES.POSTGRES_DB).toBe('points_bd');
        });

        it('should return default POSTGRES_USER when not set', () => {
            delete process.env.POSTGRES_USER;
            const { ENVIROMENT_VARIABLES } = require('@/application/shared/infrastructure/EnviromentVariables');
            expect(ENVIROMENT_VARIABLES.POSTGRES_USER).toBe('admin');
        });

        it('should return default POSTGRES_PASSWORD when not set', () => {
            delete process.env.POSTGRES_PASSWORD;
            const { ENVIROMENT_VARIABLES } = require('@/application/shared/infrastructure/EnviromentVariables');
            expect(ENVIROMENT_VARIABLES.POSTGRES_PASSWORD).toBe('admin123456');
        });

        it('should return default POSTGRES_PORT when not set', () => {
            delete process.env.POSTGRES_PORT;
            const { ENVIROMENT_VARIABLES } = require('@/application/shared/infrastructure/EnviromentVariables');
            expect(ENVIROMENT_VARIABLES.POSTGRES_PORT).toBe('5432');
        });

        it('should return default POSTGRES_HOST when not set', () => {
            delete process.env.POSTGRES_HOST;
            const { ENVIROMENT_VARIABLES } = require('@/application/shared/infrastructure/EnviromentVariables');
            expect(ENVIROMENT_VARIABLES.POSTGRES_HOST).toBe('localhost');
        });
    });

    describe('custom values', () => {
        it('should use custom PORT when set', () => {
            process.env.PORT = '8080';
            const { ENVIROMENT_VARIABLES } = require('@/application/shared/infrastructure/EnviromentVariables');
            expect(ENVIROMENT_VARIABLES.PORT).toBe('8080');
        });

        it('should use custom NODE_ENV when set', () => {
            process.env.NODE_ENV = 'production';
            const { ENVIROMENT_VARIABLES } = require('@/application/shared/infrastructure/EnviromentVariables');
            expect(ENVIROMENT_VARIABLES.NODE_ENV).toBe('production');
        });

        it('should accept test NODE_ENV', () => {
            process.env.NODE_ENV = 'test';
            const { ENVIROMENT_VARIABLES } = require('@/application/shared/infrastructure/EnviromentVariables');
            expect(ENVIROMENT_VARIABLES.NODE_ENV).toBe('test');
        });

        it('should use custom ALLOWED_ORIGINS when set', () => {
            process.env.ALLOWED_ORIGINS = 'https://example.com';
            const { ENVIROMENT_VARIABLES } = require('@/application/shared/infrastructure/EnviromentVariables');
            expect(ENVIROMENT_VARIABLES.ALLOWED_ORIGINS).toBe('https://example.com');
        });

        it('should use custom POSTGRES_DB when set', () => {
            process.env.POSTGRES_DB = 'my_database';
            const { ENVIROMENT_VARIABLES } = require('@/application/shared/infrastructure/EnviromentVariables');
            expect(ENVIROMENT_VARIABLES.POSTGRES_DB).toBe('my_database');
        });

        it('should use custom POSTGRES_USER when set', () => {
            process.env.POSTGRES_USER = 'my_user';
            const { ENVIROMENT_VARIABLES } = require('@/application/shared/infrastructure/EnviromentVariables');
            expect(ENVIROMENT_VARIABLES.POSTGRES_USER).toBe('my_user');
        });

        it('should use custom POSTGRES_PASSWORD when set', () => {
            process.env.POSTGRES_PASSWORD = 'my_password';
            const { ENVIROMENT_VARIABLES } = require('@/application/shared/infrastructure/EnviromentVariables');
            expect(ENVIROMENT_VARIABLES.POSTGRES_PASSWORD).toBe('my_password');
        });

        it('should use custom POSTGRES_PORT when set', () => {
            process.env.POSTGRES_PORT = '5433';
            const { ENVIROMENT_VARIABLES } = require('@/application/shared/infrastructure/EnviromentVariables');
            expect(ENVIROMENT_VARIABLES.POSTGRES_PORT).toBe('5433');
        });

        it('should use custom POSTGRES_HOST when set', () => {
            process.env.POSTGRES_HOST = 'db.example.com';
            const { ENVIROMENT_VARIABLES } = require('@/application/shared/infrastructure/EnviromentVariables');
            expect(ENVIROMENT_VARIABLES.POSTGRES_HOST).toBe('db.example.com');
        });
    });

    describe('interface structure', () => {
        it('should have all required properties', () => {
            const { ENVIROMENT_VARIABLES } = require('@/application/shared/infrastructure/EnviromentVariables');
            expect(ENVIROMENT_VARIABLES).toHaveProperty('PORT');
            expect(ENVIROMENT_VARIABLES).toHaveProperty('NODE_ENV');
            expect(ENVIROMENT_VARIABLES).toHaveProperty('ALLOWED_ORIGINS');
            expect(ENVIROMENT_VARIABLES).toHaveProperty('POSTGRES_DB');
            expect(ENVIROMENT_VARIABLES).toHaveProperty('POSTGRES_USER');
            expect(ENVIROMENT_VARIABLES).toHaveProperty('POSTGRES_PASSWORD');
            expect(ENVIROMENT_VARIABLES).toHaveProperty('POSTGRES_PORT');
            expect(ENVIROMENT_VARIABLES).toHaveProperty('POSTGRES_HOST');
        });
    });
});
