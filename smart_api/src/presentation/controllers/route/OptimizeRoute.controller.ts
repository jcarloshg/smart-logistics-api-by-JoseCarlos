import { Request, Response } from "express";
// import { OptimizeRouteApplication } from "@/application/optimize_route/application/optimize_route.application";
import { FactoryResponses } from "@/application/shared/models/entities/FactoryResponses";
import { GraphRepositoryPostgreSQL } from "@/application/shared/infrastructure/postgresql/repositories/GraphRepository.postgresql";
import { OptimizeRouteApplication } from "@/application/optimize_route/application/optimize_route.application";

export const OptimizeRouteController = async (req: Request, res: Response) => {
    try {

        // ─────────────────────────────────────
        // Valid id
        // ─────────────────────────────────────
        const { id } = req.params;
        const graphId = Array.isArray(id) ? id[0] : id;
        if (!graphId || graphId.trim() === '') {
            return FactoryResponses.badRequest(res, 'Graph ID is required', null);
        }

        // ─────────────────────────────────────
        // init dependencies
        // ─────────────────────────────────────
        const graphDB = new GraphRepositoryPostgreSQL();
        const useCase = new OptimizeRouteApplication(graphDB);

        // ─────────────────────────────────────
        // execute use case
        // ─────────────────────────────────────
        const result = await useCase.execute(graphId, req.body);

        res.status(result.statusCode).json({
            message: result.message,
            data: result.data
        });

    } catch (error) {
        console.log(`error: `, error);
        FactoryResponses.internalServerError(res);
    }
};
