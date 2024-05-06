import { Request, Response } from "express";
import HttpException from "../exception/HttpException";
import { PetPostRequestDTO } from "../model/dto/petPostRequestDTO";
import { getAllPets, getAllShelterPets, postAPet, postAPetToShelter } from "../service/petService";
import logger from '../config/logger';

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
        logger.info('Pet posted successfully');
    }).catch((error) => {
        logger.error('Error posting a pet: %o', error);
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
        logger.warn('Invalid shelter id provided');
        res.status(400).json(new HttpException("Invalid shelter id", 400));
        return;
    }

    postAPetToShelter(petPost, shelterId, roles).then((petPost) => {
        res.status(200).json(petPost);
        logger.info('Pet posted to shelter successfully');
    }).catch((error) => {
        logger.error('Error posting a pet to a shelter: %o', error);
        if (error instanceof HttpException) {
            res.status(error.statusCode).json(error);
        } else {
            res.status(500).json(new HttpException("Internal Server Error while posting a pet to a shelter", 500));
        }
    });
}

export const getShelterPets = async (req: Request, res: Response) => {
    /**
    #swagger.parameters['id'] = {
        description: 'Shelter id',
        in: 'path',
        required: true,
        type: 'integer'
    }

    #swagger.responses[200] = {
        schema: { $ref: "#/components/schemas/GetAllPetsInShelterResponseDTO" }
    }

    #swagger.responses[400] = {
        schema: { $ref: "#/components/schemas/HttpException" }
    }

    #swagger.tags = ['Shelter', 'Pet']

    #swagger.description = 'Endpoint to get all pets of a shelter'
    */
    const shelterId: number = +req.params.id;

    if (!shelterId || isNaN(shelterId)) {
        logger.warn('Invalid shelter id provided');
        res.status(400).json(new HttpException("Invalid shelter id", 400));
        return;
    }

    getAllShelterPets(shelterId).then((pets) => {
        res.status(200).json(pets);
        logger.info('Retrieved all pets from shelter');
    }).catch((error) => {
        logger.error('Error getting pets of a shelter: %o', error);
        if (error instanceof HttpException) {
            res.status(error.statusCode).json(error);
        } else {
            res.status(500).json(new HttpException("Internal Server Error while getting pets of a shelter", 500));
        }
    });
}

export const getPets = async (req: Request, res: Response) => {
    /**
    #swagger.responses[200] = {
        schema: { $ref: "#/components/schemas/GetAllPetPostsResponseDTO" }
    }

    #swagger.responses[400] = {
        schema: { $ref: "#/components/schemas/HttpException" }
    }

    #swagger.tags = ['Pet']

    #swagger.description = 'Endpoint to get all pets'
    */
    getAllPets().then((pets) => {
        res.status(200).json(pets);
        logger.info('Retrieved all pets');
    }).catch((error) => {
        logger.error('Error getting pets: %o', error);
        if (error instanceof HttpException) {
            res.status(error.statusCode).json(error);
        } else {
            res.status(500).json(new HttpException("Internal Server Error while getting pets", 500));
        }
    });
}