import { Router } from "express";
import categoryHandler from "../handlers/category";
import requireRole from "../middlewares/requireRole";
import requireAuth from "../middlewares/requireAuth";

const router = Router();

router.get("/", categoryHandler.findAll);

router.use([requireAuth,requireRole("ADMIN")]);

router.post("/", categoryHandler.add);
router.put("/:id", categoryHandler.update);
router.delete("/:id", categoryHandler.delete);

export default router;
