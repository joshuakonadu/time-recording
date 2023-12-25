import express from "express";
import { config } from "dotenv";
import { errorHandler } from "./middleware/errorMiddleware.js";
import "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import cors from "cors";
import morgan from "morgan";

config();
const port = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "http://localhost:9000",
    credentials: true,
  })
);
app.use(morgan("combined"));

app.use("/api/auth", userRouter);

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
