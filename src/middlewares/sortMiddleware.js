"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sortMiddleware(req, res, next) {
    res.locals.sort = {
        column: "",
        enable: false,
        type: "asc",
    };
    // eliminate
    const { column, type = "asc" } = req.query;
    if (column) {
        const isValidType = ["asc", "desc"].includes(type);
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
