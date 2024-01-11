import express from "express";
import http from "http";
import { errorHandler } from "./middleware/errorMiddleware.js";
import userRouter from "./routes/userRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";
import timerecordsRoutes from "./routes/timerecordsRoutes.js";
import invitationRoutes from "./routes/invitationRoutes.js";
import cors from "cors";
import { Server } from "socket.io";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { createClient } from "redis";
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
app.use("/api/invitation", invitationRoutes);

app.use(errorHandler);

const server = http.createServer(app);

const client = await createClient({
  url: "redis://redis:6379",
  legacyMode: true,
})
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

const io = new Server(server, {
  cors: {
    origin: "http://localhost:9000",
  },
});

io.on("connection", (socket) => {
  socket.on("user", async (id) => {
    if (id) {
      socket.userId = id;
      await client.set(id, socket.id);
    }
  });

  socket.on("new invitation", async (id, msg) => {
    const recieverSocketId = await client.get(id);
    socket.to(recieverSocketId).emit("new invitation", msg);
  });

  socket.on("disconnect", async () => {
    await client.del(socket.userId);
  });
});

server.listen(port, () => console.log(`Server started on port ${port}`));
