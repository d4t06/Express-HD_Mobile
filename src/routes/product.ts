import { Request, Router } from "express";
import productHandler from "../handlers/product";
import sortMiddleware from "../middlewares/sortMiddleware";
import requireRole from "../middlewares/requireRole";
import requireAuth from "../middlewares/requireAuth";

const productRouter = Router();

productRouter.get("/search", sortMiddleware, productHandler.search);
productRouter.get("/:productId", productHandler.findOne);

// productRouter.use();
productRouter.get("/", sortMiddleware, productHandler.findAll);

productRouter.use(requireAuth, requireRole("ADMIN"));

productRouter.post("/", productHandler.add);
productRouter.put("/:productId", productHandler.update);
productRouter.delete("/:productId", productHandler.delete);

export default productRouter;
