"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLeap = void 0;
function isLeap(year) {
    return year % 400 === 0 ? true : year % 100 === 0 ? false : year % 4 === 0;
}
exports.isLeap = isLeap;
//# sourceMappingURL=helpers.js.map