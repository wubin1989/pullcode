"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AxiosRetry = void 0;
/**
 *  请求重试机制
 */
class AxiosRetry {
    /**
     * 重试
     */
    retry(AxiosInstance, error) {
        var _a;
        const { config } = error.response;
        const { waitTime, count } = (_a = config === null || config === void 0 ? void 0 : config.requestOptions) === null || _a === void 0 ? void 0 : _a.retryRequest;
        config.__retryCount = config.__retryCount || 0;
        if (config.__retryCount >= count) {
            return Promise.reject(error);
        }
        config.__retryCount += 1;
        return this.delay(waitTime).then(() => AxiosInstance(config));
    }
    /**
     * 延迟
     */
    delay(waitTime) {
        return new Promise((resolve) => setTimeout(resolve, waitTime));
    }
}
exports.AxiosRetry = AxiosRetry;
//# sourceMappingURL=axiosRetry.js.map