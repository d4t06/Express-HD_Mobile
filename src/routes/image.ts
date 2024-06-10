import { Router } from "express";
import imageHandler from "../handlers/image";
import multer from "multer";
import requireRole from "../middlewares/requireRole";

const imageRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

imageRouter.get("/", imageHandler.findAll);

imageRouter.use(requireRole('ADMIN'))

imageRouter.post("/", upload.single("image"), imageHandler.add);
imageRouter.delete("/:id", imageHandler.delete);

export default imageRouter;
