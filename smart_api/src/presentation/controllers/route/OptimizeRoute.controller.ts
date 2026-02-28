import { Request, Response } from "express";
import { OptimizeRouteApplication } from "@/application/optimize_route/application/optimize_route.application";
import { FactoryResponses } from "@/application/shared/models/entities/FactoryResponses";
import { GraphRepositoryPostgreSQL } from "@/application/shared/infrastructure/postgresql/repositories/GraphRepository.postgresql";

export const OptimizeRouteController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { origin, destination } = req.body;

        // ─────────────────────────────────────
        // Validate parameters
        // ─────────────────────────────────────
        if (!id || id.trim() === '') {
            return FactoryResponses.badRequest(res, 'Graph ID is required', null);
        }

        if (!origin || !destination) {
            return FactoryResponses.badRequest(res, 'Origin and destination nodes are required', null);
        }

        if (typeof origin !== 'string' || typeof destination !== 'string') {
            return FactoryResponses.badRequest(res, 'Origin and destination must be strings', null);
        }

        // ─────────────────────────────────────
        // Initialize dependencies
        // ─────────────────────────────────────
        const graphDB = new GraphRepositoryPostgreSQL();
        const useCase = new OptimizeRouteApplication(graphDB);

        // ─────────────────────────────────────
        // Execute use case
        // ─────────────────────────────────────
        const result = await useCase.execute(id, origin.trim(), destination.trim());

        if (result.wasSucces) {
            FactoryResponses.ok(res, result.message, result.data);
        } else {
            FactoryResponses.badRequest(res, result.message, result.data);
        }

    } catch (error) {
        console.log(`error: `, error);
        FactoryResponses.internalServerError(res);
    }
};
