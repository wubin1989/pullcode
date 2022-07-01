"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VAxios = void 0;
const axios_1 = require("axios");
const lodash_es_1 = require("lodash-es");
const helper_1 = require("./helper");
const httpEnum_1 = require("../enums/httpEnum");
__exportStar(require("./axiosTransform"), exports);
const defaultOptions = {
    // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
    // authentication schemes，e.g: Bearer
    authenticationScheme: 'Bearer',
    timeout: 1000 * 1000,
    // 配置项，下面的选项都可以在独立的接口请求中覆盖
    requestOptions: {
        // 默认将prefix 添加到url
        joinPrefix: true,
        // 是否返回原生响应头 比如：需要获取响应头时使用该属性
        isReturnNativeResponse: false,
        // 需要对返回数据进行处理
        isTransformResponse: true,
        // post请求的时候添加参数到url
        joinParamsToUrl: false,
        // 格式化提交参数时间
        formatDate: true,
        // 消息提示类型
        errorMessageMode: 'message',
        //  是否加入时间戳
        joinTime: true,
        // 忽略重复请求
        ignoreCancelToken: true,
        // 是否携带token
        withToken: true,
        apiUrl: "",
        urlPrefix: "",
    },
};
/**
 * @description:  axios module
 */
class VAxios {
    constructor(options) {
        this.options = (0, lodash_es_1.merge)((0, lodash_es_1.cloneDeep)(defaultOptions), options || {});
        this.axiosInstance = axios_1.default.create(options);
        this.setupInterceptors();
    }
    /**
     * @description:  Create axios instance
     */
    createAxios(config) {
        this.axiosInstance = axios_1.default.create(config);
    }
    getTransform() {
        const { transform } = this.options;
        return transform;
    }
    getAxios() {
        return this.axiosInstance;
    }
    /**
     * @description: Reconfigure axios
     */
    configAxios(config) {
        if (!this.axiosInstance) {
            return;
        }
        this.createAxios(config);
    }
    /**
     * @description: Set general header
     */
    setHeader(headers) {
        if (!this.axiosInstance) {
            return;
        }
        Object.assign(this.axiosInstance.defaults.headers, headers);
    }
    /**
     * @description: Interceptor configuration
     */
    setupInterceptors() {
        const transform = this.getTransform();
        if (!transform) {
            return;
        }
        const { requestInterceptors, requestInterceptorsCatch, responseInterceptors, responseInterceptorsCatch, } = transform;
        // Request interceptor configuration processing
        this.axiosInstance.interceptors.request.use((config) => {
            var _a, _b, _c;
            const { requestOptions, axiosCanceler, tokenGetter } = this.options;
            if (requestOptions && (0, lodash_es_1.isObject)(requestOptions) && Object.keys(requestOptions).length) {
                const { apiUrl, joinPrefix, formatDate, joinTime = true, urlPrefix } = requestOptions;
                if (joinPrefix) {
                    config.url = `${urlPrefix}${config.url}`;
                }
                if (apiUrl && (0, lodash_es_1.isString)(apiUrl)) {
                    config.url = `${apiUrl}${config.url}`;
                }
                const params = config.params || {};
                const data = config.data || false;
                formatDate && data && !(0, lodash_es_1.isString)(data) && (0, helper_1.formatRequestDate)(data);
                if (((_a = config.method) === null || _a === void 0 ? void 0 : _a.toUpperCase()) === httpEnum_1.RequestEnum.GET) {
                    if (!(0, lodash_es_1.isString)(params)) {
                        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
                        config.params = Object.assign(params || {}, (0, helper_1.joinTimestamp)(joinTime, false));
                    }
                    else {
                        // 兼容restful风格
                        config.url = config.url + params + `${(0, helper_1.joinTimestamp)(joinTime, true)}`;
                        config.params = undefined;
                    }
                }
            }
            // If cancel repeat request is turned on, then cancel repeat request is prohibited
            const { 
            // @ts-ignore
            headers: { ignoreCancelToken }, } = config;
            const ignoreCancel = ignoreCancelToken !== undefined
                ? ignoreCancelToken
                : (_b = this.options.requestOptions) === null || _b === void 0 ? void 0 : _b.ignoreCancelToken;
            !ignoreCancel && axiosCanceler && axiosCanceler.addPending(config);
            // 请求之前处理config
            if (tokenGetter && (0, lodash_es_1.isFunction)(tokenGetter)) {
                const token = tokenGetter();
                if (token && ((_c = config === null || config === void 0 ? void 0 : config.requestOptions) === null || _c === void 0 ? void 0 : _c.withToken) !== false) {
                    // jwt token
                    config.headers.Authorization = this.options.authenticationScheme
                        ? `${this.options.authenticationScheme} ${token}`
                        : token;
                }
            }
            if (requestInterceptors && (0, lodash_es_1.isFunction)(requestInterceptors)) {
                config = requestInterceptors(config, this.options);
            }
            return config;
        }, undefined);
        // Request interceptor error capture
        requestInterceptorsCatch &&
            (0, lodash_es_1.isFunction)(requestInterceptorsCatch) &&
            this.axiosInstance.interceptors.request.use(undefined, requestInterceptorsCatch);
        // Response result interceptor processing
        this.axiosInstance.interceptors.response.use((res) => {
            const { axiosCanceler } = this.options;
            res && axiosCanceler && axiosCanceler.removePending(res.config);
            if (responseInterceptors && (0, lodash_es_1.isFunction)(responseInterceptors)) {
                if (this.options.requestOptions && this.options.requestOptions.isReturnNativeResponse) {
                    return responseInterceptors(res, this.options);
                }
                return responseInterceptors(res.data, this.options);
            }
            if (this.options.requestOptions && this.options.requestOptions.isReturnNativeResponse) {
                return res;
            }
            return res.data;
        }, undefined);
        // Response result interceptor error capture
        responseInterceptorsCatch &&
            (0, lodash_es_1.isFunction)(responseInterceptorsCatch) &&
            this.axiosInstance.interceptors.response.use(undefined, (error) => {
                // @ts-ignore
                return responseInterceptorsCatch(this.axiosInstance, error);
            });
    }
}
exports.VAxios = VAxios;
//# sourceMappingURL=Axios.js.map