import { Router } from "express";
import priceRange from "../handlers/priceRange";
import requireRole from "../middlewares/requireRole";

const priceRangeRouter = Router();

priceRangeRouter.use(requireRole('ADMIN'))

priceRangeRouter.post("/", priceRange.add);
priceRangeRouter.put("/:id", priceRange.update);
priceRangeRouter.delete("/:id", priceRange.delete);

export default priceRangeRouter;
