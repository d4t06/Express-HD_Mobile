require("dotenv").config({ path: `.env.local`, override: true });

import express from "express";
import errorHandler from "./src/middlewares/globalErrorHandler";
import routeHandler from "./src/routes";
import connectDB from "./conectDB";
const cookiesParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const port = 3000 || 3000;

app.use(express.json());
app.use(cookiesParser());
app.use(
   cors({
      credentials: true,
      origin: process.env.CORS_WHITE_LIST?.split(", "),
   })
);

routeHandler(app);

app.use(errorHandler);

app.listen(port, () => {
   console.log(
      `[server]: Server is running at http://localhost:${port}, ${process.env.NODE_ENV}`
   );
   console.log(process.env.CORS_WHITE_LIST?.split(", "));
});

connectDB();
