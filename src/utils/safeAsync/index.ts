import express from "express";

export default function safeAsync(fn: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<any>) {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch((err) => next(err));
    }
}