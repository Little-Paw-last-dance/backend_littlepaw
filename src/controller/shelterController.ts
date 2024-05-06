import { ShelterRegisterDTO } from "../model/dto/shelterRegisterDTO";
import {Request, Response} from "express";
import { registerAShelter, getAShelterById, getAllTheShelters, deleteAShelter, updateAShelter } from "../service/shelterService";
import HttpException from "../exception/HttpException";
import { ShelterUpdateDTO } from "../model/dto/shelterUpdateDTO";
import logger from "../config/logger";

export const registerShelter = async (req: Request, res: Response) => {
    /**
    #swagger.requestBody = {
        required: true,
        type: "object",
        schema: { $ref: "#/components/schemas/ShelterRegisterDTO" }
    }

    #swagger.responses[200] = {
        schema: { $ref: "#/components/schemas/ShelterResponse" }
    }

    #swagger.responses[400] = {
        schema: { $ref: "#/components/schemas/HttpException" }
    }

    #swagger.tags = ['Shelter']

    #swagger.description = 'Endpoint to register a new shelter (Requires admin role)'
    */
    const shelterRegisterDTO: ShelterRegisterDTO = res.locals.shelterRegister;
    const userEmail: string = res.locals.firebaseUser.email;
    registerAShelter(shelterRegisterDTO, userEmail).then((shelter) => {
        res.status(200).json(shelter);
        logger.info('Shelter registered successfully');
    }).catch((error) => {
        logger.error('Error registering a shelter: %o', error);
        if(error instanceof HttpException) {
            res.status(error.statusCode).json(error);
        } else {
            res.status(500).json(new HttpException("Internal Server Error while registering shelter", 500))
        } 
    });
    
};

export const updateShelter = async (req: Request, res: Response) => {
    /**
    #swagger.requestBody = {
        required: true,
        type: "object",
        schema: { $ref: "#/components/schemas/ShelterUpdateDTO" }
    }

    #swagger.responses[200] = {
        schema: { $ref: "#/components/schemas/ShelterResponse" }
    }

    #swagger.responses[400] = {
        schema: { $ref: "#/components/schemas/HttpException" }
    }

    #swagger.tags = ['Shelter']

    #swagger.description = 'Endpoint to update a shelter by id'
    */
    const id: number = parseInt(req.params.id);
    const shelterUpdateDTO: ShelterUpdateDTO = res.locals.shelterUpdate;
    const userEmail: string = res.locals.firebaseUser.email;
    updateAShelter(id, shelterUpdateDTO, userEmail).then((shelter) => {
        res.status(200).json(shelter);
        logger.info('Shelter updated successfully');
    }).catch((error) => {
        logger.error('Error updating a shelter: %o', error);
        if(error instanceof HttpException) {
            res.status(error.statusCode).json(error);
        } else {
            res.status(500).json(new HttpException("Internal Server Error while updating shelter", 500))
        } 
    });
    
}

export const getShelter = async (req: Request, res: Response) => {
    /**
    #swagger.responses[200] = {
        schema: { $ref: "#/components/schemas/ShelterResponse" }
    }

    #swagger.responses[400] = {
        schema: { $ref: "#/components/schemas/HttpException" }
    }

    #swagger.tags = ['Shelter']

    #swagger.description = 'Endpoint to get a shelter by id'
    */
    const id: number = parseInt(req.params.id);
    getAShelterById(id).then((shelter) => {
        res.status(200).json(shelter);
        logger.info('Shelter retrieved successfully');
    }).catch((error) => {
        logger.error('Error getting a shelter: %o', error);
        if(error instanceof HttpException) {
            res.status(error.statusCode).json(error);
        } else {
            res.status(500).json(new HttpException("Internal Server Error while getting shelter", 500))
        } 
    });
    
}


export const getAllShelters = async (req: Request, res: Response) => {
    /**
    #swagger.responses[200] = {
        schema: { $ref: "#/components/schemas/SheltersResponse" }
    }

    #swagger.responses[400] = {
        schema: { $ref: "#/components/schemas/HttpException" }
    }

    #swagger.tags = ['Shelter']

    #swagger.description = 'Endpoint to get all shelters'
    */

    getAllTheShelters().then((shelters) => {
        res.status(200).json(shelters);
        logger.info('Retrieved all shelters');
    }).catch((error) => {
        logger.error('Error getting shelters: %o', error);
        if(error instanceof HttpException) {
            res.status(error.statusCode).json(error);
        } else {
            res.status(500).json(new HttpException("Internal Server Error while getting shelters", 500))
        } 
    })
    
}

export const deleteShelter = async (req: Request, res: Response) => {
    /**
    #swagger.responses[200] = {
        schema: { $ref: "#/components/schemas/ShelterResponse" }
    }

    #swagger.responses[400] = {
        schema: { $ref: "#/components/schemas/HttpException" }
    }

    #swagger.tags = ['Shelter']

    #swagger.description = 'Endpoint to delete a shelter by id'
    */
    const id: number = parseInt(req.params.id);
    const userEmail: string = res.locals.firebaseUser.email;
    deleteAShelter(id, userEmail).then((shelter) => {
        res.status(200).json(shelter);
        logger.info('Shelter deleted successfully');
    }).catch((error) => {
        logger.error('Error deleting a shelter: %o', error);
        if(error instanceof HttpException) {
            res.status(error.statusCode).json(error);
        } else {
            res.status(500).json(new HttpException("Internal Server Error while deleting shelter", 500))
        } 
    });
    
}