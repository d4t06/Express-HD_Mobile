import { Router } from "express";
import attributeHandler from "../handlers/productAttribute";
import requireRole from "../middlewares/requireRole";

const productAttributeRouter = Router();

productAttributeRouter.use(requireRole('ADMIN'))

productAttributeRouter.post("/", attributeHandler.add);
productAttributeRouter.put("/:id", attributeHandler.update);

export default productAttributeRouter;
