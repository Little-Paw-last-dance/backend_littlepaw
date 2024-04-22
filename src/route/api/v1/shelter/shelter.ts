import express from 'express';
import { shelterRegisterValidationMiddleware } from '../../../../middleware/shelter';
import { registerShelter } from '../../../../controller/shelterController';
import { authenticationValidation } from '../../../../middleware/authValidation';

const shelterRouter = express.Router();

shelterRouter.post("/", [shelterRegisterValidationMiddleware, authenticationValidation], registerShelter);

export default shelterRouter;