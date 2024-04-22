import express from "express";
import userRouter from "./user/user";
import petRouter from "./pet/pet";

const v1Router = express.Router();

v1Router.use("/user", [userRouter]);
v1Router.use("/pet", [petRouter]);

export default v1Router;