import { Router } from "express";
import defaultProductVariantHandler from "../handlers/defaultProductVariant";
import requireRole from "../middlewares/requireRole";
import requireAuth from "../middlewares/requireAuth";

const defaultProductVariantRouter = Router();

defaultProductVariantRouter.use(requireAuth, requireRole('ADMIN'))

defaultProductVariantRouter.put("/:id", defaultProductVariantHandler.update);

export default defaultProductVariantRouter;
