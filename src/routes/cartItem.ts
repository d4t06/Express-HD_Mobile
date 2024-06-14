import { Router } from "express";
import cartItemHandler from "../handlers/cartItem";
import decodeToken from "../middlewares/decodeToken";

const cartItemRouter = Router();

cartItemRouter.get("/:username", cartItemHandler.findAll);

cartItemRouter.use(decodeToken);

cartItemRouter.post("/", cartItemHandler.add);
cartItemRouter.put("/:id", cartItemHandler.update);
cartItemRouter.delete("/:id", cartItemHandler.delete);

export default cartItemRouter;
