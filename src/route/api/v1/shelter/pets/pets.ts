import express from "express";
import { authenticationValidation } from "../../../../../middleware/authValidation";
import { getShelterPets } from "../../../../../controller/petController";

const petsShelterRouter = express.Router({ mergeParams: true });

petsShelterRouter.get("/", [authenticationValidation], getShelterPets);

export default petsShelterRouter;