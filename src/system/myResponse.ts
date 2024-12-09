import { Response } from "express";

export default function myResponse(
   res: Response,
   flag: boolean,
   message: string,
   code: number,
   data?: any
) {
   return res.status(code).json({ flag, message, code, time: new Date().toLocaleString(), data: data || null });
}
