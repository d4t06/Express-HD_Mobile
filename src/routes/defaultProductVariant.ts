import { Router } from "express";
import defaultProductVariantHandler from "../handlers/defaultProductVariant";
import requireRole from "../middlewares/requireRole";

const defaultProductVariantRouter = Router();

defaultProductVariantRouter.use(requireRole('ADMIN'))

defaultProductVariantRouter.put("/:id", defaultProductVariantHandler.update);

export default defaultProductVariantRouter;
