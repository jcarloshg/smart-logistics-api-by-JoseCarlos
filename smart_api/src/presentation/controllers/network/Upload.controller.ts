import { FactoryResponses } from "@/application/shared/models/entities/FactoryResponses";
import { Request, Response } from "express";

export const UploadController = async (req: Request, res: Response) => {
    try {
        FactoryResponses.ok(res, "Network uploaded successfully", null);
    } catch (error) {
        console.log(`error: `, error);
        FactoryResponses.internalServerError(res);
    }
};
