import { Router } from "express";
import cartItemHandler from "../handlers/cartItem";
import requireAuth from "../middlewares/requireAuth";

const cartItemRouter = Router();

cartItemRouter.get("/:username", cartItemHandler.findAll);

cartItemRouter.use(requireAuth);

cartItemRouter.post("/", cartItemHandler.add);
cartItemRouter.put("/:id", cartItemHandler.update);
cartItemRouter.delete("/:id", cartItemHandler.delete);

export default cartItemRouter;
