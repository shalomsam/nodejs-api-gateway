import express from "express";
import helmet from 'helmet';
import routes from './routes/v1'

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());

app.use('/', routes);

export default app;
