import express from "express";
import { userRegisterValidationMiddleware } from "../../../../middleware/user";
import { getUser, userRegister } from "../../../../controller/userController";
import { authenticationValidation, getRoles } from "../../../../middleware/authValidation";

const userRouter = express.Router();

userRouter.post("/", [userRegisterValidationMiddleware, authenticationValidation, getRoles], userRegister);

userRouter.get("/", [authenticationValidation], getUser);

export default userRouter;