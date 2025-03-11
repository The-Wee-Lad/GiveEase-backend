class ApiResponse{
    constructor(statusCode, data, message, subCode = 0){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.subCode = subCode
    }
}

export {ApiResponse};