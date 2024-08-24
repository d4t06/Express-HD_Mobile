import { Router } from "express";

import RatingManagementHandler from "../handlers/ratingManagement";
import requireRole from "../middlewares/requireRole";
import requireAuth from "../middlewares/requireAuth";

const ratingManagementRouter = Router();

ratingManagementRouter.use(requireAuth, requireRole("ADMIN"));

ratingManagementRouter.put("/", RatingManagementHandler.approve);
ratingManagementRouter.delete("/:id", RatingManagementHandler.delete);

export default ratingManagementRouter;
