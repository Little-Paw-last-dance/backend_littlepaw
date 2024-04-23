import express from 'express';
import { shelterRegisterValidationMiddleware } from '../../../../middleware/shelter';
import { registerShelter, getShelter, getAllShelters } from '../../../../controller/shelterController';
import { authenticationValidation } from '../../../../middleware/authValidation';

const shelterRouter = express.Router();

shelterRouter.post("/", [shelterRegisterValidationMiddleware, authenticationValidation], registerShelter);
shelterRouter.get("/:id", getShelter);
shelterRouter.get("/", getAllShelters);

export default shelterRouter;