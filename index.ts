require("dotenv").config({ path: `.env.local`, override: true });

import express from "express";
import errorHandler from "./src/middlewares/globalErrorHandler";
import routeHandler from "./src/routes";
import connectDB from "./conectDB";
const cookiesParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookiesParser());
app.use(
   cors({
      credentials: true,
      origin: ["http://localhost:5173", "http://localhost:4200", "https://d4t06.github.io"],
   })
);

routeHandler(app);

app.use(errorHandler);

app.listen(port, () => {
   console.log(
      `[server]: Server is running at http://localhost:${port}, ${process.env.NODE_ENV}`
   );
});

connectDB();
