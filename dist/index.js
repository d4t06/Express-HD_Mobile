"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config({ path: `.env.local`, override: true });
const express_1 = __importDefault(require("express"));
const globalErrorHandler_1 = __importDefault(require("./src/middlewares/globalErrorHandler"));
const routes_1 = __importDefault(require("./src/routes"));
const conectDB_1 = __importDefault(require("./conectDB"));
const cookiesParser = require("cookie-parser");
const cors = require("cors");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use(cookiesParser());
app.use(cors({
    credentials: true,
    origin: ["http://localhost:5173", "https://d4t06.github.io"],
}));
(0, routes_1.default)(app);
app.use(globalErrorHandler_1.default);
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}, ${process.env.NODE_ENV}`);
});
(0, conectDB_1.default)();
