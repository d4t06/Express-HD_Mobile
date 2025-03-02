"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const myResponse_1 = __importDefault(require("../system/myResponse"));
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const chromium_1 = __importDefault(require("@sparticuz/chromium"));
class PdfHanlder {
    generate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const defaultOpts = { format: "a5" };
                const { content = "<h1>This is simple content</h1>", option = defaultOpts } = req.body;
                const browser = yield puppeteer_core_1.default.launch({
                    args: chromium_1.default.args,
                    defaultViewport: chromium_1.default.defaultViewport,
                    executablePath: yield chromium_1.default.executablePath(),
                    headless: true,
                });
                const page = yield browser.newPage();
                yield page.setContent(content);
                const pdf = yield page.pdf(Object.assign({ printBackground: true }, option));
                yield page.close();
                yield browser.close();
                const base64PDF = Buffer.from(pdf).toString("base64");
                return (0, myResponse_1.default)(res, true, "Generate pdf successful", 200, base64PDF);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = PdfHanlder;
