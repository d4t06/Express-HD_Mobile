"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sortMiddleware(req, res, next) {
    res.locals.sort = {
        column: "",
        enable: false,
        type: "ASC",
    };
    // eliminate
    const { column, type = "ASC" } = req.query;
    if (column) {
        const isValidType = ["ASC", "DESC"].includes(type);
        const isValidColumn = ["price", "installment"].includes(column);
        Object.assign(res.locals.sort, {
            enable: isValidColumn && isValidType ? true : false,
            type,
            column,
        });
    }
    else {
        // không cần else ở đay bì, mỗi một request sẽ có res.locals.sort mới
    }
    next();
}
exports.default = sortMiddleware;
