"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentTypeEnum = exports.RequestEnum = exports.ResultEnum = void 0;
/**
 * @description: Request result set
 */
var ResultEnum;
(function (ResultEnum) {
    ResultEnum[ResultEnum["SUCCESS"] = 0] = "SUCCESS";
    ResultEnum[ResultEnum["ERROR"] = 1] = "ERROR";
    ResultEnum[ResultEnum["TIMEOUT"] = 401] = "TIMEOUT";
    ResultEnum["TYPE"] = "success";
})(ResultEnum = exports.ResultEnum || (exports.ResultEnum = {}));
/**
 * @description: request method
 */
var RequestEnum;
(function (RequestEnum) {
    RequestEnum["GET"] = "GET";
    RequestEnum["POST"] = "POST";
    RequestEnum["PUT"] = "PUT";
    RequestEnum["DELETE"] = "DELETE";
})(RequestEnum = exports.RequestEnum || (exports.RequestEnum = {}));
/**
 * @description:  contentTyp
 */
var ContentTypeEnum;
(function (ContentTypeEnum) {
    // json
    ContentTypeEnum["JSON"] = "application/json;charset=UTF-8";
    // form-data qs
    ContentTypeEnum["FORM_URLENCODED"] = "application/x-www-form-urlencoded;charset=UTF-8";
    // form-data  upload
    ContentTypeEnum["FORM_DATA"] = "multipart/form-data;charset=UTF-8";
})(ContentTypeEnum = exports.ContentTypeEnum || (exports.ContentTypeEnum = {}));
//# sourceMappingURL=httpEnum.js.map