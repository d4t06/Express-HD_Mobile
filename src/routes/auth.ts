import { Router } from "express";
import authHandler from "../handlers/auth";

const authRouter = Router();

authRouter.post("/login", authHandler.login);
authRouter.post("/register", authHandler.register);
authRouter.get("/refresh", authHandler.refreshToken);
authRouter.get("/logout", authHandler.logout);

export default authRouter;
