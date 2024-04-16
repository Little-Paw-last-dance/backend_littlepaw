import { Request, Response } from "express";
import { UserRegisterDTO } from "../model/dto/userRegisterDTO";
import { getUserInfo, registerUser } from "../service/userService";
import HttpException from "../exception/HttpException";
import { FirebaseUser } from "../model/FirebaseUser";


export const userRegister = async (req: Request, res: Response) => {
    /**
    #swagger.requestBody = {
        required: true,
        type: "object",
        schema: { $ref: "#/components/schemas/UserRegisterDTO" }
    }

    #swagger.responses[200] = {
        schema: { $ref: "#/components/schemas/UserResponse" }
    }

    #swagger.responses[400] = {
        schema: { $ref: "#/components/schemas/HttpException" }
    }

    #swagger.tags = ['User']

    #swagger.description = 'Endpoint to register a new user'
    */
    const userRegisterRequest: UserRegisterDTO = res.locals.user;
    const roles = res.locals.roles;

    registerUser(userRegisterRequest, roles).then((user) => {
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

export const getUser = async (req: Request, res: Response) => {
    /**
    #swagger.responses[200] = {
        schema: { $ref: "#/components/schemas/UserResponse" }
    }
    
    #swagger.responses[400] = {
        schema: { $ref: "#/components/schemas/HttpException" }
    }
    
    #swagger.tags = ['User']
    
    #swagger.description = 'Endpoint to get user information'
    */
    const firebaseUser: FirebaseUser = res.locals.firebaseUser;

    getUserInfo(firebaseUser.email).then((user) => {
        res.status(200).json({ user });
    }).catch((error) => {
        console.error(error);
        if (error instanceof HttpException) {
            res.status(error.statusCode).json(error);
        } else {
            res.status(500).json(new HttpException("Internal server error while getting user information", 500));
        }
    });
};