import express from 'express';
import { shelterRegisterValidationMiddleware, shelterUpdateValidationMiddleware } from '../../../../middleware/shelter';
import { registerShelter, getShelter, getAllShelters, deleteShelter, updateShelter} from '../../../../controller/shelterController';
import { authenticationValidation } from '../../../../middleware/authValidation';
import petShelterRouter from './pet/pet';

const shelterRouter = express.Router();

shelterRouter.use("/:id/pet", [petShelterRouter]);

shelterRouter.post("/", [shelterRegisterValidationMiddleware, authenticationValidation], registerShelter);
shelterRouter.patch("/:id", [shelterUpdateValidationMiddleware, authenticationValidation], updateShelter);
shelterRouter.get("/:id", getShelter);
shelterRouter.get("/", getAllShelters);
shelterRouter.delete("/:id", authenticationValidation,deleteShelter);

export default shelterRouter;