import { Router } from "express";
import sortMiddleware from "../middlewares/sortMiddleware";
import ProductManagementHandler from "../handlers/productManagement";

const productManagementRouter = Router();

productManagementRouter.get(
   "/products",
   sortMiddleware,
   ProductManagementHandler.findAll
);
productManagementRouter.get(
   "/duplicate/:id",
   ProductManagementHandler.duplicate
);

productManagementRouter.post(
   "/json-import",
   ProductManagementHandler.JSONImport
);

export default productManagementRouter;
