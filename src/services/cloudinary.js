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
const cloudinary_1 = __importDefault(require("cloudinary"));
cloudinary_1.default.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});
class ImageService {
    upload(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield cloudinary_1.default.v2.uploader.upload(data, {
                resource_type: "auto",
                folder: process.env.NODE_ENV === "development" ? "test" : "hd-mobile",
            });
            return res;
        });
    }
    delete(publicId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield cloudinary_1.default.v2.uploader.destroy(publicId);
        });
    }
}
exports.default = new ImageService();
