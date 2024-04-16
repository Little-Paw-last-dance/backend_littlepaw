import { Request, Response } from "express";
import { UserRegisterDTO } from "../model/dto/userRegisterDTO";
import { registerUser } from "../service/userService";


export const userRegister = async (req: Request, res: Response) => {
    const userRegisterRequest: UserRegisterDTO = res.locals.user;

    registerUser(userRegisterRequest).then((user) => {
        res.status(200).json({ user });
    }).catch((error) => {
        res.status(500).send(error);
    });
};