import { Router } from "express";
import brandHandler from "../handlers/brand";
import requireRole from "../middlewares/requireRole";

const brandRouter = Router();

brandRouter.use(requireRole("ADMIN"));

brandRouter.post("/", brandHandler.add);
brandRouter.put("/:id", brandHandler.update);
brandRouter.delete("/:id", brandHandler.delete);

export default brandRouter;
