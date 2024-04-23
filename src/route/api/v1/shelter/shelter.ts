import express from 'express';
import { shelterRegisterValidationMiddleware } from '../../../../middleware/shelter';
import { registerShelter, getShelter } from '../../../../controller/shelterController';
import { authenticationValidation } from '../../../../middleware/authValidation';

const shelterRouter = express.Router();

shelterRouter.post("/", [shelterRegisterValidationMiddleware, authenticationValidation], registerShelter);
shelterRouter.get("/:id", getShelter);

export default shelterRouter;