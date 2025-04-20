export class CustomError extends Error {
    statusCode: number;
    constructor(statusCode: number = 500, message: string = 'Internal Server Error') {
        super(message)
        this.statusCode = statusCode
    }
}

export const sendResponse = (status: boolean = true, message = 'Request Processed Successfully!!', data: null | object = null) => ({ status, message, data })
export const sendWebSocketResponse = (status: boolean = true, type = '', data: null | object = null) => ({ status, type, data })
