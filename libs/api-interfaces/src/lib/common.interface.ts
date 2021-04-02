export type voidFn = (...args: readonly any[]) => void;

export enum ResponseStatus {
    success = "success",
    failed = "failed"
}

export const ApiResponse = {
    OK: {
        statusCode: 200,
        status: ResponseStatus.success,
        message: "Ok"
    },
    BAD: {
        statusCode: 400,
        status: ResponseStatus.failed,
        message: "Bad Request"
    },
    UNAUTH: {
        statusCode: 401,
        status: ResponseStatus.failed,
        message: "Unauthorized"
    },
    NOTFOUND: {
        statusCode: 404,
        status: ResponseStatus.failed,
        message: "Not Found"
    }
}

