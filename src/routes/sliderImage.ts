import { Router } from "express";
import sliderImage from "../handlers/sliderImage";
import requireRole from "../middlewares/requireRole";
import requireAuth from "../middlewares/requireAuth";

const sliderImageRouter = Router();

sliderImageRouter.use(requireAuth, requireRole('ADMIN'))

sliderImageRouter.post("/", sliderImage.add);
sliderImageRouter.put("/:id", sliderImage.update);
sliderImageRouter.delete("/:id", sliderImage.delete);

export default sliderImageRouter;
