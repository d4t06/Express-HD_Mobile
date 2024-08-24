import { Router } from "express";
import attributeHandler from "../handlers/productAttribute";
import requireRole from "../middlewares/requireRole";
import requireAuth from "../middlewares/requireAuth";

const productAttributeRouter = Router();

productAttributeRouter.use(requireAuth, requireRole('ADMIN'))

productAttributeRouter.post("/", attributeHandler.add);
productAttributeRouter.put("/:id", attributeHandler.update);

export default productAttributeRouter;
