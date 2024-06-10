import { Router } from "express";
import variantHandler from "../handlers/variant";
import requireRole from "../middlewares/requireRole";

const variantRouter = Router();

variantRouter.use(requireRole("ADMIN"));

variantRouter.post("/", variantHandler.add);
variantRouter.put("/:id", variantHandler.update);
variantRouter.delete("/:id", variantHandler.delete);

export default variantRouter;
