import { Router } from "express";

import RatingManagementHandler from "../handlers/ratingManagement";
import requireRole from "../middlewares/requireRole";

const ratingManagementRouter = Router();


ratingManagementRouter.get("/", RatingManagementHandler.findAll);

ratingManagementRouter.use(requireRole("ADMIN"));

ratingManagementRouter.put("/:id", RatingManagementHandler.approve);
ratingManagementRouter.delete("/:id", RatingManagementHandler.delete);

export default ratingManagementRouter;
