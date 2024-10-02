import { Router } from "express";
import combineHandler from "../handlers/combine";
import requireRole from "../middlewares/requireRole";
import requireAuth from "../middlewares/requireAuth";

const combineRouter = Router();

combineRouter.use(requireAuth,requireRole('ADMIN'))

combineRouter.put("/:id", combineHandler.update);

export default combineRouter;
