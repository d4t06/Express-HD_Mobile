import { Router } from "express";
import categoryAttribute from "../handlers/categoryAttribute";
import requireRole from "../middlewares/requireRole";
import requireAuth from "../middlewares/requireAuth";

const priceRangeRouter = Router();

priceRangeRouter.use([requireAuth, requireRole("ADMIN")]);

priceRangeRouter.post("/", categoryAttribute.add);
priceRangeRouter.put("/:id", categoryAttribute.update);
priceRangeRouter.delete("/:id", categoryAttribute.delete);

export default priceRangeRouter;
