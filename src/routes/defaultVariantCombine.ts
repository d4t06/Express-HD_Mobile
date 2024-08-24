import { Router } from "express";
import defaultVariantCombineHandler from "../handlers/defaultVariantCombine";
import requireRole from "../middlewares/requireRole";
import requireAuth from "../middlewares/requireAuth";

const defaultVariantCombineRouter = Router();

defaultVariantCombineRouter.use(requireAuth, requireRole('ADMIN'))

defaultVariantCombineRouter.put("/:id", defaultVariantCombineHandler.update);

export default defaultVariantCombineRouter;
