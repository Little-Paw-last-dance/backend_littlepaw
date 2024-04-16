import express from "express";
import { userRegisterValidationMiddleware } from "../../../../middleware/user";
import { userRegister } from "../../../../controller/userController";

const userRouter = express.Router();

userRouter.post("/", [userRegisterValidationMiddleware], userRegister);

export default userRouter;