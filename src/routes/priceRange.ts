import { Router } from "express";
import priceRange from "../handlers/priceRange";
import requireRole from "../middlewares/requireRole";
import requireAuth from "../middlewares/requireAuth";

const priceRangeRouter = Router();

priceRangeRouter.use(requireAuth, requireRole('ADMIN'))

priceRangeRouter.post("/", priceRange.add);
priceRangeRouter.put("/:id", priceRange.update);
priceRangeRouter.delete("/:id", priceRange.delete);

export default priceRangeRouter;
