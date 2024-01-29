import env from "dotenv";
env.config();
import express, { Express } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import postRouter from "./routes/post";
import userRouter from "./routes/user";
import chatRouter from "./routes/chat";
import authRouter from "./routes/auth";
import fileRouter from "./routes/file";


const initApp = (): Promise<Express> => {
  const promise = new Promise<Express>((resolve) => {
    const db = mongoose.connection;
    db.once("open", () => console.log("Connected to Database"));
    db.on("error", (error) => console.error(error));
    const url = process.env.DB_URL;
    mongoose.connect(url!, { dbName: "web-server-db" }).then(() => {
      const app = express();
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "*");
        res.header("Access-Control-Allow-Headers", "*");
        next();
      });
      app.use("/post", postRouter);
      app.use("/chat", chatRouter);
      app.use("/user", userRouter);
      app.use("/auth", authRouter);
      app.use("/file", fileRouter);
      app.use("/public", express.static("public"));
      resolve(app);
    });
  });
  return promise;
};

export default initApp;
