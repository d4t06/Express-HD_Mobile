import { Router } from "express";
import sliderImage from "../handlers/sliderImage";
import requireRole from "../middlewares/requireRole";

const sliderImageRouter = Router();

sliderImageRouter.use(requireRole('ADMIN'))

sliderImageRouter.post("/", sliderImage.add);
sliderImageRouter.put("/:id", sliderImage.update);
sliderImageRouter.delete("/:id", sliderImage.delete);

export default sliderImageRouter;
