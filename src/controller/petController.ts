import { Request, Response } from "express";
import HttpException from "../exception/HttpException";
import { FirebaseUser } from "../model/firebaseUser";
import { PetPostRequestDTO } from "../model/dto/petPostRequestDTO";
import { postAPet, postAPetToShelter } from "../service/petService";


export const postPet = async (req: Request, res: Response) => {
    /**
    #swagger.requestBody = {
        required: true,
        type: "object",
        schema: { $ref: "#/components/schemas/PetPostRequestDTO" }
    }

    #swagger.responses[200] = {
        schema: { $ref: "#/components/schemas/PetPostResponseDTO" }
    }

    #swagger.responses[400] = {
        schema: { $ref: "#/components/schemas/HttpException" }
    }

    #swagger.tags = ['Pet']

    #swagger.description = 'Endpoint to post a pet'
    */
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

export const postPetToShelter = async (req: Request, res: Response) => {
    /**
    #swagger.parameters['id'] = {
        description: 'Shelter id',
        in: 'path',
        required: true,
        type: 'integer'
    }

    #swagger.requestBody = {
        required: true,
        type: "object",
        schema: { $ref: "#/components/schemas/PetPostRequestDTO" }
    }

    #swagger.responses[200] = {
        schema: { $ref: "#/components/schemas/PetShelterPostResponseDTO" }
    }

    #swagger.responses[400] = {
        schema: { $ref: "#/components/schemas/HttpException" }
    }

    #swagger.tags = ['Shelter', 'Pet']

    #swagger.description = 'Endpoint to post a pet to a shelter'
    */
    const petPost: PetPostRequestDTO = res.locals.petPost;
    const shelterId: number = +req.params.id;
    const roles = res.locals.roles;

    if (!shelterId || isNaN(shelterId)) {
        res.status(400).json(new HttpException("Invalid shelter id", 400));
        return;
    }

    postAPetToShelter(petPost, shelterId, roles).then((petPost) => {
        res.status(200).json(petPost);
    }).catch((error) => {
        console.error(error);
        if (error instanceof HttpException) {
            res.status(error.statusCode).json(error);
        } else {
            res.status(500).json(new HttpException("Internal Server Error while posting a pet to a shelter", 500));
        }
    });
}