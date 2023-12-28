import express from "express";
import { errorHandler } from "./middleware/errorMiddleware.js";
import userRouter from "./routes/userRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";
import timerecordsRoutes from "./routes/timerecordsRoutes.js";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import "./config/env.js";
import "./config/db.js";

const port = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:9000",
    credentials: true,
  })
);
//app.use(morgan("combined"));

app.use("/api/auth", userRouter);
app.use("/api/workspace", workspaceRoutes);
app.use("/api/timerecords", timerecordsRoutes);

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
