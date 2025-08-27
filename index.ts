// must place at top
import "./configEnv";

import express from "express";
import errorHandler from "./src/middlewares/globalErrorHandler";
import routeHandler from "./src/routes";
import connectDB from "./conectDB";
import cookiesParser from "cookie-parser";
import cors from "cors";

const port = process.env.PORT || 4000;
const whiteList = (process.env.WHITE_LIST || "").split(", ");

const app = express();

// for request body
app.use(express.json());
// for request cookie
app.use(cookiesParser());
// enable cors
app.use(
  cors({
    credentials: true,
    origin: whiteList,
  }),
);

// index route
routeHandler(app);

// global error middleware, must place after routes for catch error
app.use(errorHandler);

app.listen(port, () => {
  console.log(`[server]: Server is running at port: ${port}`);
  console.log("white list: ", whiteList);
});

// connect to database
connectDB();
