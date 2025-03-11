class ApiError extends Error{
    constructor(statusCode, message = "Something went wrong", errors = [], stack = "", cause){
        super(message);
        this.statusCode = statusCode;
        this.message =  message;
        this.success = false;
        this.errors = errors;
        this.cause = cause;

        if(stack){
            this.stack = stack;
        }else{
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
export { ApiError };