import { ShelterRegisterDTO } from "../model/dto/shelterRegisterDTO";
import {Request, Response} from "express";
import { registerAShelter } from "../service/shelterService";
import HttpException from "../exception/HttpException";
export const registerShelter = async (req: Request, res: Response) => {
    const shelterRegisterDTO: ShelterRegisterDTO = res.locals.shelterRegister;
    registerAShelter(shelterRegisterDTO).then((shelter) => {
        res.status(200).json(shelter);
    }).catch((error) => {
        console.error(error);
        if(error instanceof HttpException) {
            res.status(error.statusCode).json(error);
        } else {
            res.status(500).json(new HttpException("Internal Server Error while registering shelter", 500))
        } 
    });
    
};