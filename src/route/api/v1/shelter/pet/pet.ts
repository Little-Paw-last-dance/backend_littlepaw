import express from "express";
import { authenticationValidation, getRoles } from "../../../../../middleware/authValidation";
import { petPostValidationMiddleware } from "../../../../../middleware/pet";
import { postPetToShelter } from "../../../../../controller/petController";

const petShelterRouter = express.Router({ mergeParams: true });

petShelterRouter.post("/", [petPostValidationMiddleware, authenticationValidation, getRoles], postPetToShelter);

export default petShelterRouter;