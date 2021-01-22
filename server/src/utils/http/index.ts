export enum Status {
    success = "success",
    failed = "failed"
}

export const ApiResponse = {
    OK: {
        statusCode: 200,
        status: Status.success,
        message: "Ok"
    },
    BAD: {
        statusCode: 400,
        status: Status.failed,
        message: "Bad Request"
    },
    UNAUTH: {
        statusCode: 401,
        status: Status.failed,
        message: "Unauthorized"
    }
}

