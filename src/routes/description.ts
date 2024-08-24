import { Router } from "express";
import descHandler from "../handlers/description";
import requireRole from "../middlewares/requireRole";
import requireAuth from "../middlewares/requireAuth";

const descriptionRouter = Router();

descriptionRouter.use(requireAuth, requireRole('ADMIN'))

descriptionRouter.put("/:productId", descHandler.update);

export default descriptionRouter;
