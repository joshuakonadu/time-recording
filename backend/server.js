import express from "express";
import { config } from "dotenv";
import { errorHandler } from "./middleware/errorMiddleware.js";
import './config/db.js'
import userRouter from './routes/userRoutes.js'

config()
const port = process.env.PORT || 5000;


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/users', userRouter);


app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));