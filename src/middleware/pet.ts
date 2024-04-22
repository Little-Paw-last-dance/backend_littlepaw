import {validate} from "class-validator"
import {Request, Response, NextFunction} from "express"
import { PetPostRequestDTO } from "../model/dto/petPostRequestDTO";
import { PetPostValidation } from "../validation/petPostValidation";


export const petPostValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const petPostRequest: PetPostRequestDTO = req.body;

    const validPetPost = new PetPostValidation(petPostRequest);
    validate(validPetPost).then(errors => {
        if (errors.length > 0) {
            const errorsResponse = errors.map(error => {
                return {
                    property: error.property,
                    value: error.value,
                    constraints: error.constraints
                }
            })
            res.status(400).json({errors: { validationErrors: errorsResponse }})
        } else {
            res.locals.petPost = validPetPost
            next()
        }
    })
}