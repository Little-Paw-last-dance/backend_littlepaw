import express from 'express';
import { shelterRegisterValidationMiddleware } from '../../../../middleware/shelter';
import { registerShelter } from '../../../../controller/shelterController';

const shelterRouter = express.Router();

shelterRouter.post("/", shelterRegisterValidationMiddleware, registerShelter);

export default shelterRouter;