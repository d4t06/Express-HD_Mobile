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
const BadRequest_1 = __importDefault(require("../errors/BadRequest"));
const ObjectNotFound_1 = __importDefault(require("../errors/ObjectNotFound"));
const image_1 = __importDefault(require("../models/image"));
const cloudinary_1 = __importDefault(require("../services/cloudinary"));
const cloudinary_2 = __importDefault(require("cloudinary"));
const helper_1 = require("../system/helper");
const PAGE_SIZE = 6;
cloudinary_2.default.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});
class priceRangeHandler {
    findAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, size } = req.query;
                const _size = (size && typeof size === "string" && +size < 50 && +size) ||
                    PAGE_SIZE;
                const _page = (page && typeof page === "string" && +page) || 1;
                const { rows, count } = yield image_1.default.findAndCountAll({
                    offset: (+_page - 1) * _size,
                    limit: _size,
                    order: [["createdAt", "DESC"]],
                });
                return (0, myResponse_1.default)(res, true, "add image successful", 200, {
                    images: rows,
                    count,
                    page: _page,
                    page_size: _size,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    uploadFile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const file = req.file;
                if (!file)
                    throw new BadRequest_1.default("");
                const { buffer, mimetype } = file;
                const b64 = Buffer.from(buffer).toString("base64");
                let dataURI = "data:" + mimetype + ";base64," + b64;
                const imageRes = yield cloudinary_1.default.upload(dataURI);
                const imageInfo = {
                    name: (0, helper_1.generateId)(file.originalname),
                    public_id: imageRes.public_id,
                    image_url: imageRes.secure_url,
                    size: Math.ceil(imageRes.bytes / 1024),
                };
                const newImage = yield image_1.default.create(imageInfo);
                return (0, myResponse_1.default)(res, true, "Upload image successful", 200, newImage);
            }
            catch (error) {
                next(error);
            }
        });
    }
    uploadUrl(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { imageUrl } = req.params;
                if (!imageUrl)
                    throw new BadRequest_1.default("");
                const imageRes = yield cloudinary_1.default.upload(imageUrl);
                const imageInfo = {
                    name: Date.now() + "",
                    public_id: imageRes.public_id,
                    image_url: imageRes.secure_url,
                    size: Math.ceil(imageRes.bytes / 1024),
                };
                const newImage = yield image_1.default.create(imageInfo);
                return (0, myResponse_1.default)(res, true, "Upload image successful", 200, newImage);
            }
            catch (error) {
                next(error);
            }
        });
    }
    delete(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const item = yield image_1.default.findOne({
                    where: {
                        public_id: id,
                    },
                });
                if (!item)
                    throw new ObjectNotFound_1.default("");
                yield cloudinary_1.default.delete(id);
                yield item.destroy();
                return (0, myResponse_1.default)(res, true, "Delete image successful", 200);
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
    }
}
exports.default = new priceRangeHandler();
