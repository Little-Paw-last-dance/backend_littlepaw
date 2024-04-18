import { Request, Response } from "express";
import { UserRegisterRolesDTO } from "../model/dto/userRegisterRolesDTO";
import { getUserInfo, registerUser, registerUserWithRoles, updateUserInfo } from "../service/userService";
import HttpException from "../exception/HttpException";
import { FirebaseUser } from "../model/firebaseUser";
import { UserRegisterDTO } from "../model/dto/userRegisterDTO";
import { UserUpdateDTO } from "../model/dto/userUpdateDTO";


export const userRegisterWithRoles = async (req: Request, res: Response) => {
    /**
    #swagger.requestBody = {
        required: true,
        type: "object",
        schema: { $ref: "#/components/schemas/UserRegisterRolesDTO" }
    }

    #swagger.responses[200] = {
        schema: { $ref: "#/components/schemas/UserResponse" }
    }

    #swagger.responses[400] = {
        schema: { $ref: "#/components/schemas/HttpException" }
    }

    #swagger.tags = ['User']

    #swagger.description = 'Endpoint to register a new user with roles (Requires admin role)'
    */
    const userRegisterRequest: UserRegisterRolesDTO = res.locals.user;
    const roles = res.locals.roles;

    registerUserWithRoles(userRegisterRequest, roles).then((user) => {
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

export const updateUser = async (req: Request, res: Response) => {
    /**
    #swagger.requestBody = {
        required: true,
        type: "object",
        schema: { $ref: "#/components/schemas/UserUpdateDTO" }
    }

    #swagger.responses[200] = {
        schema: { $ref: "#/components/schemas/UserResponse" }
    }

    #swagger.responses[400] = {
        schema: { $ref: "#/components/schemas/HttpException" }
    }

    #swagger.tags = ['User']

    #swagger.description = 'Endpoint to update user information'
    */
    const userEmail = res.locals.firebaseUser.email;
    const userUpdateRequest: UserUpdateDTO = res.locals.user;

    updateUserInfo(userEmail, userUpdateRequest).then((user) => {
        res.status(200).json({ user });
    }).catch((error) => {
        console.error(error);
        if (error instanceof HttpException) {
            res.status(error.statusCode).json(error);
        } else {
            res.status(500).json(new HttpException("Internal server error while updating user information", 500));
        }
    });
};