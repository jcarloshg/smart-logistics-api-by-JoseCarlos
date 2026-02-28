import { Request, Response } from "express";
import { ReadGraphApplication } from "@/application/read_graph/application/read_graph.application";
import { FactoryResponses } from "@/application/shared/models/entities/FactoryResponses";
import { GraphRepositoryPostgreSQL } from "@/application/shared/infrastructure/postgresql/repositories/GraphRepository.postgresql";

export const ReadNodesController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // ─────────────────────────────────────
        // Validate ID parameter
        // ─────────────────────────────────────
        if (!id || id.trim() === '') {
            return FactoryResponses.badRequest(res, 'Graph ID is required', null);
        }

        // ─────────────────────────────────────
        // Initialize dependencies
        // ─────────────────────────────────────
        const graphDB = new GraphRepositoryPostgreSQL();
        const useCase = new ReadGraphApplication(graphDB);

        // ─────────────────────────────────────
        // Execute use case
        // ─────────────────────────────────────
        const result = await useCase.execute(id);

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