import { Router } from "express";
import combineHandler from "../handlers/combine";
import requireRole from "../middlewares/requireRole";

const combineRouter = Router();
combineRouter.use(requireRole('ADMIN'))
combineRouter.put("/:id", combineHandler.update);

export default combineRouter;
