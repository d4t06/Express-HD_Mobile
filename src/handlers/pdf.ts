import { NextFunction, Request, Response } from "express";
import myResponse from "../system/myResponse";

import puppeteer, { PDFOptions } from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export default class PdfHanlder {
	async generate(
		req: Request<{}, {}, { content: string; option: PDFOptions }>,
		res: Response,
		next: NextFunction,
	) {
		try {
			const defaultOpts: PDFOptions = { format: "a5" };

			const { content = "<h1>This is simple content</h1>", option = defaultOpts } =
				req.body;

			const browser = await puppeteer.launch({
				args: chromium.args,
				defaultViewport: chromium.defaultViewport,
				executablePath: await chromium.executablePath(),
				headless: true,
			});
			const page = await browser.newPage();
			await page.setContent(content);
			const pdf = await page.pdf({
				printBackground: true,
				...option,
			});

			await page.close();
			await browser.close();

			const base64PDF = Buffer.from(pdf).toString("base64");

			return myResponse(res, true, "Generate pdf successful", 200, base64PDF);
		} catch (error) {
			next(error);
		}
	}
}
