import { Request, Response } from "express";

import { CreateGraphApplication } from "@/application/create_graph/application/create_graph.application";
import { FactoryResponses } from "@/application/shared/models/entities/FactoryResponses";
import { GraphRepositoryPostgreSQL } from "@/application/shared/infrastructure/postgresql/repositories/GraphRepository.postgresql";

export const UploadController = async (req: Request, res: Response) => {
    try {

        // ─────────────────────────────────────
        // init dependencies
        // ─────────────────────────────────────
        const graphDB = new GraphRepositoryPostgreSQL();
        const useCase = new CreateGraphApplication(graphDB);

        // ─────────────────────────────────────
        // execute use case
        // ─────────────────────────────────────
        const result = await useCase.execute(req.body);

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
