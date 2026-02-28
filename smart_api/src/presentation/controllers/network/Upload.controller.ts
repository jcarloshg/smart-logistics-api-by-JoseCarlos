import { Request, Response } from "express";

export const UploadController = async (
    req: Request,
    res: Response,
) => {

    try {
        console.log(`req.body: `, req.body);
        res.status(200).json(req)
    } catch (error) {

    }

}