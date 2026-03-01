export interface CustomResponse {
    statusCode: number;
    message: string;
    data?: any;
}

export class CustomResponse {
    static ok(message: string = 'Success', data?: any): CustomResponse {
        return {
            statusCode: 200,
            message,
            data
        };
    }

    static created(message: string = 'Created', data?: any): CustomResponse {
        return {
            statusCode: 201,
            message,
            data
        };
    }

    static badRequest(message: string = 'Bad Request', data?: any): CustomResponse {
        return {
            statusCode: 400,
            message,
            data
        };
    }

    static unauthorized(message: string = 'Unauthorized', data?: any): CustomResponse {
        return {
            statusCode: 401,
            message,
            data
        };
    }

    static forbidden(message: string = 'Forbidden', data?: any): CustomResponse {
        return {
            statusCode: 403,
            message,
            data
        };
    }

    static notFound(message: string = 'Not Found', data?: any): CustomResponse {
        return {
            statusCode: 404,
            message,
            data
        };
    }

    static internalServerError(message: string = 'Internal Server Error', data?: any): CustomResponse {
        return {
            statusCode: 500,
            message,
            data
        };
    }

    static notImplemented(message: string = 'Not Implemented', data?: any): CustomResponse {
        return {
            statusCode: 501,
            message,
            data
        };
    }

    static badGateway(message: string = 'Bad Gateway', data?: any): CustomResponse {
        return {
            statusCode: 502,
            message,
            data
        };
    }

    static serviceUnavailable(message: string = 'Service Unavailable', data?: any): CustomResponse {
        return {
            statusCode: 503,
            message,
            data
        };
    }
}
