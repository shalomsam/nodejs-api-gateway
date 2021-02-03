import express from "express";
import helmet from 'helmet';
import routes from './routes';
import cookieParser from 'cookie-parser';
import { apiNotFoundHandler } from "./utils/http";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cookieParser());
app.use(express.static("dist"));
app.use(express.static("public"));

app.use('/', routes);

app.use(apiNotFoundHandler);


export default app;
