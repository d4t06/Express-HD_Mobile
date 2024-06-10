import { Router } from "express";
import categoryAttribute from "../handlers/categoryAttribute";
import requireRole from "../middlewares/requireRole";

const priceRangeRouter = Router();

priceRangeRouter.use(requireRole('ADMIN'))

priceRangeRouter.post("/", categoryAttribute.add);
priceRangeRouter.put("/:id", categoryAttribute.update);
priceRangeRouter.delete("/:id", categoryAttribute.delete);

export default priceRangeRouter;
