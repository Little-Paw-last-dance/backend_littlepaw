import { Request, Response } from "express";
import { UserRegisterDTO } from "../model/dto/userRegisterDTO";
import { registerUser } from "../service/userService";
import HttpException from "../exception/HttpException";


export const userRegister = async (req: Request, res: Response) => {
    const userRegisterRequest: UserRegisterDTO = res.locals.user;

    registerUser(userRegisterRequest).then((user) => {
        res.status(200).json({ user });
    }).catch((error) => {
        console.error(error);
        if (error instanceof HttpException) {
            res.status(error.statusCode).json(error);
        } else {
            res.status(500).json(new HttpException("Internal server error while registering user", 500));
        }
    });
};