/**
 *  请求重试机制
 */
export class AxiosRetry {
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
//# sourceMappingURL=axiosRetry.js.map