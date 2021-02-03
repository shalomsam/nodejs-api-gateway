import express from 'express';

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
    },
    NOTFOUND: {
        statusCode: 404,
        status: Status.failed,
        message: "Not Found"
    }
}

export const apiNotFoundHandler = function (req, res, next) {
    res.status(404);

    // respond with html page
    if (req.headers["content-type"].indexOf('html') > -1) {
        res.type("txt").send("Not found");
        return;
    }

    // respond with json
    if (req.headers["content-type"].indexOf('json') > -1) {
        res.send(ApiResponse.NOTFOUND);
        return;
    }

    // default to plain-text. send()
    res.type("txt").send("Not found");
}
