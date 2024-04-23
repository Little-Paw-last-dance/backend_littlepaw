import express from 'express';
import { shelterRegisterValidationMiddleware, shelterUpdateValidationMiddleware } from '../../../../middleware/shelter';
import { registerShelter, getShelter, getAllShelters, deleteShelter, updateShelter} from '../../../../controller/shelterController';
import { authenticationValidation } from '../../../../middleware/authValidation';

const shelterRouter = express.Router();

shelterRouter.post("/", [shelterRegisterValidationMiddleware, authenticationValidation], registerShelter);
shelterRouter.patch("/:id", [shelterUpdateValidationMiddleware, authenticationValidation], updateShelter);
shelterRouter.get("/:id", getShelter);
shelterRouter.get("/", getAllShelters);
shelterRouter.delete("/:id", deleteShelter);

export default shelterRouter;