import {validate} from "class-validator"
import {Request, Response, NextFunction} from "express"
import { UserRegisterValidation } from "../validation/userRegisterValidation";
import { UserRegisterRolesDTO } from "../model/dto/UserRegisterRolesDTO";
import { UserRegisterDTO } from "../model/dto/UserRegisterDTO";
import { UserRegisterWithRolesValidation } from "../validation/userRegisterWithRolesValidation";

export const userRegisterWithRolesValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const userRegisterRequest: UserRegisterRolesDTO = req.body;

    const validUser = new UserRegisterWithRolesValidation(userRegisterRequest);
    validate(validUser).then(errors => {
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
            res.locals.user = validUser
            next()
        }
    })
}

export const userRegisterValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const userRegisterRequest: UserRegisterDTO = req.body;

    const validUser = new UserRegisterValidation(userRegisterRequest);
    validate(validUser).then(errors => {
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
            res.locals.user = validUser
            next()
        }
    })
}
