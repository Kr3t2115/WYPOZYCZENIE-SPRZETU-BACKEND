import {config} from 'dotenv';
config()

import swaggerUi from "swagger-ui-express";
import {swaggerSpec} from "./docs/swagger.js";


import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import routes from './routes/routes.js';
import {errorHandler} from "./utils/errorHandler.js";

import {connectDB} from './config/db.js';
connectDB()

const app = express();

app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);


app.use(express.json());

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

app.use(cookieParser())

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

// PING PONG TEST
app.get('/', (req, res) => {
    res.json({ping:"pong"});
})

app.use('/api', routes);

app.use(errorHandler)
