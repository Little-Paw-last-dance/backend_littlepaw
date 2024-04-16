import express from "express";
import { userRegisterValidationMiddleware } from "../../../../middleware/user";
import { userRegister } from "../../../../controller/userController";
import { authenticationValidation, getRoles } from "../../../../middleware/authValidation";

const userRouter = express.Router();

userRouter.post("/", [userRegisterValidationMiddleware, authenticationValidation, getRoles], userRegister);

export default userRouter;