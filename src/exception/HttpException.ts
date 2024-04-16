class HttpException extends Error {
    readonly statusCode: number;
    readonly message: string;
    readonly errors?: any;

    constructor(message: string, statusCode: number, errors?: any) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default HttpException;