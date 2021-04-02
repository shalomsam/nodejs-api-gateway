import * as express from "express";
import * as helmet from "helmet";
import cookieParser from "cookie-parser";
import routes from "../routes";
import { apiNotFoundHandler } from "../utils/helpers";

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
