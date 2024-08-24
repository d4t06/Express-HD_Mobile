import { Router } from "express";
import brandHandler from "../handlers/brand";
import requireRole from "../middlewares/requireRole";
import requireAuth from "../middlewares/requireAuth";

const brandRouter = Router();

brandRouter.use([requireAuth, requireRole("ADMIN")]);

brandRouter.post("/", brandHandler.add);
brandRouter.put("/:id", brandHandler.update);
brandRouter.delete("/:id", brandHandler.delete);

export default brandRouter;
