import { AxiosError, AxiosInstance } from 'axios';
/**
 *  请求重试机制
 */
export declare class AxiosRetry {
    /**
     * 重试
     */
    retry(AxiosInstance: AxiosInstance, error: AxiosError): Promise<import("axios").AxiosResponse<any, any>>;
    /**
     * 延迟
     */
    private delay;
}
//# sourceMappingURL=axiosRetry.d.ts.map