import { Request, Response } from "express";
import HttpException from "../exception/HttpException";
import { FirebaseUser } from "../model/firebaseUser";
import { PetPostRequestDTO } from "../model/dto/petPostRequestDTO";
import { postAPet } from "../service/petService";


export const postPet = async (req: Request, res: Response) => {
    const userEmail: string = res.locals.firebaseUser.email;
    const petPost: PetPostRequestDTO = res.locals.petPost;

    postAPet(petPost, userEmail).then((petPost) => {
        res.status(200).json(petPost);
    }).catch((error) => {
        console.error(error);
        if (error instanceof HttpException) {
            res.status(error.statusCode).json(error);
        } else {
            res.status(500).json(new HttpException("Internal Server Error while posting a pet", 500));
        }
    });
};