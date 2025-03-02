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
const BadRequest_1 = __importDefault(require("../errors/BadRequest"));
const productRating_1 = __importDefault(require("../models/productRating"));
const myResponse_1 = __importDefault(require("../system/myResponse"));
const sequelize_1 = require("sequelize");
const SIZE = 6;
class RatingManagementHandler {
    //   async findAll(
    //     req: Request<{}, {}, {}, { page: number; size: number }>,
    //     res: Response,
    //     next: NextFunction
    //   ) {
    //     try {
    //       const { page, size } = req.query;
    //       const _page = (page && typeof page === "string" && +page) || 1;
    //       const _size = (size && typeof size === "string" && +size) || SIZE;
    //       const { rows, count } = await Rating.findAndCountAll({
    //         offset: (_page - 1) * _size,
    //         limit: _size,
    //         order: [["id", "DESC"]],
    //       });
    //       if (rows.length) {
    //         rows.forEach((item) => {
    //           item["date_convert"] = countDateDiff(item["createdAt"]);
    //         });
    //       }
    //       const resData = {
    //         ratings: rows,
    //         page: _page,
    //         size: _size,
    //         count,
    //       };
    //       return myResponse(res, true, "Get ratings successful", 200, resData);
    //     } catch (error) {
    //       next(error);
    //     }
    //   }
    approve(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const idList = body.id_list;
                yield productRating_1.default.update({ approve: 1 }, {
                    where: {
                        id: {
                            [sequelize_1.Op.in]: idList,
                        },
                    },
                });
                return (0, myResponse_1.default)(res, true, "Approve rating successful", 200);
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
                if (!id || typeof id !== "string" || isNaN(+id))
                    throw new BadRequest_1.default("");
                yield productRating_1.default.destroy({ where: { id } });
                return (0, myResponse_1.default)(res, true, "Delete rating successful", 200);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new RatingManagementHandler();
