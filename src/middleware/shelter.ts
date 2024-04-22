import {validate} from 'class-validator';
import {Request, Response, NextFunction} from 'express';
import { ShelterRegisterDTO } from '../model/dto/shelterRegisterDTO';
import { ShelterRegisterValidation } from '../validation/shelterRegisterValidation';

export const shelterRegisterValidationMiddleware =  (req: Request, res: Response, next: NextFunction) => {
    const shelterRegisterDTO: ShelterRegisterDTO = req.body;
    const validShelterRegister = new ShelterRegisterValidation(shelterRegisterDTO);
    validate(validShelterRegister).then(errors => {
        if (errors.length > 0) {
            const errorsResponse = errors.map(error => {
                return {
                    property: error.property,
                    value: error.value,
                    constraints: error.constraints
                }
            })
            res.status(400).json({errors: {validationErrors: errorsResponse}})
        } else {
            res.locals.shelterRegister = validShelterRegister;
            next();
        }
    });
}