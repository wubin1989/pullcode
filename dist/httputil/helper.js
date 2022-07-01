"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatRequestDate = exports.joinTimestamp = void 0;
const lodash_es_1 = require("lodash-es");
const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
function joinTimestamp(join, restful = false) {
    if (!join) {
        return restful ? '' : {};
    }
    const now = new Date().getTime();
    if (restful) {
        return `?_t=${now}`;
    }
    return { _t: now };
}
exports.joinTimestamp = joinTimestamp;
/**
 * @description: Format request parameter time
 */
function formatRequestDate(params) {
    var _a, _b;
    if (Object.prototype.toString.call(params) !== '[object Object]') {
        return;
    }
    for (const key in params) {
        const format = (_b = (_a = params[key]) === null || _a === void 0 ? void 0 : _a.format) !== null && _b !== void 0 ? _b : null;
        if (format && typeof format === 'function') {
            params[key] = params[key].format(DATE_TIME_FORMAT);
        }
        if ((0, lodash_es_1.isString)(key)) {
            const value = params[key];
            if (value) {
                try {
                    params[key] = (0, lodash_es_1.isString)(value) ? value.trim() : value;
                }
                catch (error) {
                    throw new Error(error);
                }
            }
        }
        if ((0, lodash_es_1.isObject)(params[key])) {
            formatRequestDate(params[key]);
        }
    }
}
exports.formatRequestDate = formatRequestDate;
//# sourceMappingURL=helper.js.map