import express from "express";
import { authenticationValidation } from "../../../../middleware/authValidation";
import { getPets, postPet } from "../../../../controller/petController";
import { petPostValidationMiddleware } from "../../../../middleware/pet";

const petRouter = express.Router();

petRouter.post("/", [petPostValidationMiddleware, authenticationValidation], postPet);
petRouter.get("/", [authenticationValidation], getPets);

export default petRouter;