import { Router } from "express";
import colorRange from "../handlers/color";
import requireRole from "../middlewares/requireRole";

const ColorRouter = Router();

ColorRouter.use(requireRole('ADMIN'))

ColorRouter.post("/", colorRange.add);
ColorRouter.put("/:id", colorRange.update);
ColorRouter.delete("/:id", colorRange.delete);

export default ColorRouter;
