// **** PATH /api/init

import { Router } from "express";

const initRouter = Router();

import initHandler from "../handlers/init";

initRouter.post("", initHandler.init);

export default initRouter;
