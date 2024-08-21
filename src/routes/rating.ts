import { Router } from "express";
import RatingHandler from '../handlers/rating'

const ratingRouter = Router();


ratingRouter.post("/", RatingHandler.add);
ratingRouter.get("/", RatingHandler.getProductRating);
ratingRouter.get("/avg", RatingHandler.getAverage);

export default ratingRouter;
