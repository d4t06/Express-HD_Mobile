import { Router } from "express";
import defaultVariantCombineHandler from "../handlers/defaultVariantCombine";
import requireRole from "../middlewares/requireRole";

const defaultVariantCombineRouter = Router();

defaultVariantCombineRouter.use(requireRole('ADMIN'))

defaultVariantCombineRouter.put("/:id", defaultVariantCombineHandler.update);

export default defaultVariantCombineRouter;
