import express from "express";
import { userRegisterValidationMiddleware, userRegisterWithRolesValidationMiddleware } from "../../../../middleware/user";
import { getUser, userRegister, userRegisterWithRoles } from "../../../../controller/userController";
import { authenticationValidation, getRoles } from "../../../../middleware/authValidation";

const userRouter = express.Router();

userRouter.post("/admin", [userRegisterWithRolesValidationMiddleware, authenticationValidation, getRoles], userRegisterWithRoles);

userRouter.post("/", [userRegisterValidationMiddleware], userRegister);

userRouter.get("/", [authenticationValidation], getUser);

export default userRouter;