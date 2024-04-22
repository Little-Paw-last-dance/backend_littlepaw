import express from "express";
import { authenticationValidation } from "../../../../middleware/authValidation";
import { postPet } from "../../../../controller/petController";
import { petPostValidationMiddleware } from "../../../../middleware/pet";

const petRouter = express.Router();

petRouter.post("/", [petPostValidationMiddleware, authenticationValidation], postPet);

export default petRouter;