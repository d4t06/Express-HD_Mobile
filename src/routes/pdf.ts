// **** PATH /api/pdf

import { Router } from "express";
import PdfHanlder from "../handlers/pdf";

const pdfRouter = Router();

const handler = new PdfHanlder();

pdfRouter.post("", handler.generate);

export default pdfRouter;
