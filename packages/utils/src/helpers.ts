class CustomError extends Error {
    statusCode: number;
    constructor(statusCode: number = 500, message: string = 'Internal Server Error') {
        super(message)
        this.statusCode = statusCode
    }
}

const sendResponse = (status: boolean = true, message = 'Request Processed Successfully!!', data: null | object = null) => ({ status, message, data })

export { sendResponse, CustomError }