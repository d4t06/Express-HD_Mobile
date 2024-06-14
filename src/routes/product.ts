import { Request, Router } from "express";
import productHandler from "../handlers/product";
import sortMiddleware from "../middlewares/sortMiddleware";
import requireRole from "../middlewares/requireRole";

const productRouter = Router();

productRouter.get("/search", sortMiddleware, productHandler.search);
productRouter.get("/:productAscii", productHandler.findOne);

// productRouter.use();
productRouter.get("/", sortMiddleware, productHandler.findAll);

productRouter.use(requireRole("ADMIN"));

productRouter.post("/", productHandler.add);
productRouter.put("/:productAscii", productHandler.update);
productRouter.delete("/:productAscii", productHandler.delete);

export default productRouter;
