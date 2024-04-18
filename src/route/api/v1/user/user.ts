import express from "express";
import { userRegisterValidationMiddleware, userRegisterWithRolesValidationMiddleware, userUpdateValidationMiddleware } from "../../../../middleware/user";
import { deleteUser, getUser, updateUser, userRegister, userRegisterWithRoles } from "../../../../controller/userController";
import { authenticationValidation, getRoles } from "../../../../middleware/authValidation";

const userRouter = express.Router();

userRouter.post("/admin", [userRegisterWithRolesValidationMiddleware, authenticationValidation, getRoles], userRegisterWithRoles);

userRouter.post("/", [userRegisterValidationMiddleware], userRegister);

userRouter.patch("/", [userUpdateValidationMiddleware, authenticationValidation], updateUser);

userRouter.delete("/", [authenticationValidation], deleteUser);

userRouter.get("/", [authenticationValidation], getUser);

export default userRouter;