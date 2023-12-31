class ApiError extends Error {
    statusCode: number;
    message: string;
    isOperational: boolean;
    stack?: string;

    constructor(statusCode: number, message: string, isOperational: boolean = true, stack: string = "") {
        super(message);

        this.statusCode = statusCode;
        this.message = message;
        this.isOperational = isOperational;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;
