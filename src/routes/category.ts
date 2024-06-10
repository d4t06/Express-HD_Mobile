import { Router } from "express";
import categoryHandler from "../handlers/category";
import requireRole from "../middlewares/requireRole";

const router = Router();

router.get("/", categoryHandler.findAll);

router.use(requireRole("ADMIN"));

router.post("/", categoryHandler.add);
router.put("/:id", categoryHandler.update);
router.delete("/:id", categoryHandler.delete);

export default router;
