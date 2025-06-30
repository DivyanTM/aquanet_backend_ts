import express from "express";
import AuthRouter from "./routes/AuthRouter"; import errorMiddleware from "./middleware/ErrorMiddleware";
import morgan from "morgan";
import SensorDataRouter from "./routes/SensorDataRoutes";
import cors from "cors";

const app = express();

app.use(cors({
    origin: "*",
    exposedHeaders: ['Authorization',"Content-Type","Accept"],
}));

app.use(express.json());
app.use(morgan('dev'));

app.use('/auth', AuthRouter);
app.use('/sensor',SensorDataRouter);

app.use(errorMiddleware);

export default app;
