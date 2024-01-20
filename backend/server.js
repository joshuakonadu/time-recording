import cluster from "cluster";
import { cpus } from "os";
import express from "express";
import http from "http";
import { errorHandler } from "./middleware/errorMiddleware.js";
import userRouter from "./routes/userRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";
import timerecordsRoutes from "./routes/timerecordsRoutes.js";
import invitationRoutes from "./routes/invitationRoutes.js";
import cors from "cors";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import { createClient } from "redis";
import { createAdapter, setupPrimary } from "@socket.io/cluster-adapter";
import "./config/env.js";
import "./config/db.js";

if (cluster.isMaster) {
  const availableCpus = cpus();
  console.log(`Master ${process.pid} is running`);
  console.log(`${availableCpus.length} processes`);

  // setup connections between the workers
  setupPrimary();

  // Node.js > 16.0.0
  // cluster.setupPrimary({
  //   serialization: "advanced",
  // });

  availableCpus.forEach(() => cluster.fork());

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  console.log(`Worker ${process.pid} started`);

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

  app.use("/api/auth", userRouter);
  app.use("/api/workspace", workspaceRoutes);
  app.use("/api/timerecords", timerecordsRoutes);
  app.use("/api/invitation", invitationRoutes);

  app.use(errorHandler);

  const server = http.createServer(app);

  const client = await createClient({
    url: process.env.REDIS_URI || "redis://127.0.0.1:6379",
    legacyMode: true,
  })
    .on("error", (err) => console.error("Redis Client Error", err))
    .connect();

  const io = new Server(server, {
    transports: ["websocket"],
    cors: {
      origin: "http://localhost:9000",
    },
  });

  // use the cluster adapter
  io.adapter(createAdapter());

  io.on("connection", (socket) => {
    socket.on("user", async (id) => {
      if (id) {
        socket.userId = id;
        client.set(id, socket.id, (err) => {
          if (err) console.error("err setting redis data");
          //console.log(id + " connected");
        });
      }
    });

    socket.on("update", async (id, serializedCmd) => {
      client.get(id, (err, val) => {
        if (err) {
          return;
        }
        socket.to(val).emit("update", serializedCmd);
      });
    });

    socket.on("close-connection", () => {
      client.get(socket.userId, (err, val) => {
        if (err) {
          return;
        }
        client.del(socket.userId);
      });
    });

    socket.on("disconnect", () => {
      client.get(socket.userId, (err, val) => {
        if (err) {
          //console.error("err getting redis data");
          return;
        }
        client.del(socket.userId);
      });
    });
  });

  server.listen(port, () => console.log(`Server started on port ${port}`));

  process.on("exit", cleanUpRedis);

  process.on("SIGINT", cleanUpRedis);

  process.on("uncaughtException", cleanUpRedis);

  function cleanUpRedis() {
    client.flushAll();
  }
}
