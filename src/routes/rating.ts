import { Router } from "express";
import RatingHandler from "../handlers/rating";
import requireAuth from "../middlewares/requireAuth";

const ratingRouter = Router();

ratingRouter.get("/", RatingHandler.getProductRating);
ratingRouter.get("/avg", RatingHandler.getAverage);

ratingRouter.use(requireAuth);
ratingRouter.post("/", RatingHandler.add);

export default ratingRouter;
