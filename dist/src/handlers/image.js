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
const cloudinary_1 = __importDefault(require("cloudinary"));
const helper_1 = require("../system/helper");
const PAGE_SIZE = 6;
cloudinary_1.default.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});
class priceRangeHandler {
    findAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, size } = req.query;
                const _size = (size && typeof size === "string" && +size < 12 && +size) || PAGE_SIZE;
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
    add(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const file = req.file;
                if (!file)
                    throw new BadRequest_1.default("");
                const { buffer, mimetype, originalname, size } = file;
                const b64 = Buffer.from(buffer).toString("base64");
                let dataURI = "data:" + mimetype + ";base64," + b64;
                const imageUploadRes = yield cloudinary_1.default.v2.uploader.upload(dataURI, {
                    resource_type: "auto",
                    folder: "hd-mobile-test",
                });
                const imageInfo = {
                    name: (0, helper_1.generateId)(originalname),
                    public_id: imageUploadRes.public_id,
                    image_url: imageUploadRes.url,
                    size: Math.ceil(size / 1000),
                };
                const newImage = yield image_1.default.create(imageInfo);
                return (0, myResponse_1.default)(res, true, "add image successful", 200, newImage);
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
                if (Number.isNaN(+id))
                    throw new BadRequest_1.default("");
                const item = yield image_1.default.findByPk(id);
                if (!item)
                    throw new ObjectNotFound_1.default("");
                item.destroy();
                return (0, myResponse_1.default)(res, true, "delete price range successful", 200);
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
    }
}
exports.default = new priceRangeHandler();
