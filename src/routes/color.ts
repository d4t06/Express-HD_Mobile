import { Router } from "express";
import colorRange from "../handlers/color";
import requireRole from "../middlewares/requireRole";
import requireAuth from "../middlewares/requireAuth";

const ColorRouter = Router();

ColorRouter.use(requireAuth, requireRole('ADMIN'))

ColorRouter.post("/", colorRange.add);
ColorRouter.put("/:id", colorRange.update);
ColorRouter.delete("/:id", colorRange.delete);

export default ColorRouter;
