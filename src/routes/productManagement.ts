import { Router } from "express";
import sortMiddleware from "../middlewares/sortMiddleware";
import ProductManagementHandler from "../handlers/productManagement";
import requireAuth from "../middlewares/requireAuth";
import requireRole from "../middlewares/requireRole";

const productManagementRouter = Router();

productManagementRouter.use(requireAuth, requireRole("ADMIN"));

productManagementRouter.get(
   "/products",
   sortMiddleware,
   ProductManagementHandler.findAll,
);

productManagementRouter.get("/search", ProductManagementHandler.search);

productManagementRouter.get("/duplicate/:id", ProductManagementHandler.duplicate);

productManagementRouter.post("/json-import", ProductManagementHandler.JSONImport);

export default productManagementRouter;
