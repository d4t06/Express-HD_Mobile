import { Router } from "express";
import descHandler from "../handlers/description";
import requireRole from "../middlewares/requireRole";

const descriptionRouter = Router();

descriptionRouter.use(requireRole('ADMIN'))

descriptionRouter.put("/:productAscii", descHandler.update);

export default descriptionRouter;
