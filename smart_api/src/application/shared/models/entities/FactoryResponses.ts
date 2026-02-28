import { Response } from 'express';

export class FactoryResponses {

    // ─────────────────────────────────────
    // CODE 2xx http
    // ─────────────────────────────────────

    static created(res: Response, message: string = 'Created', data: any) {
        res.status(201).json({
            message: message,
            data: data
        });
    }

    static ok(res: Response, message: string = 'Success', data: any) {
        res.status(200).json({
            message,
            data
        });
    }

    // ─────────────────────────────────────
    // CODE 4xx http
    // ─────────────────────────────────────

    static badRequest(res: Response, message: string = 'Bad Request', data: any = undefined) {
        res.status(400).json({
            message,
            data
        });
    }

    static unauthorized(res: Response, message: string = 'Unauthorized', data: any = undefined) {
        res.status(401).json({
            message,
            data
        });
    }

    static forbidden(res: Response, message: string = 'Forbidden', data: any = undefined) {
        res.status(403).json({
            message,
            data
        });
    }

    static notFound(res: Response, message: string = 'Not Found', data: any = undefined) {
        res.status(404).json({
            message,
            data
        });
    }

    // ─────────────────────────────────────
    // CODE 5xx http
    // ─────────────────────────────────────

    static internalServerError(res: Response, message: string = 'Internal Server Error', data: any = undefined) {
        res.status(500).json({
            message,
            data
        });
    }

    static notImplemented(res: Response, message: string = 'Not Implemented', data: any = undefined) {
        res.status(501).json({
            message,
            data
        });
    }

    static badGateway(res: Response, message: string = 'Bad Gateway', data: any = undefined) {
        res.status(502).json({
            message,
            data
        });
    }

    static serviceUnavailable(res: Response, message: string = 'Service Unavailable', data: any = undefined) {
        res.status(503).json({
            message,
            data
        });
    }

}