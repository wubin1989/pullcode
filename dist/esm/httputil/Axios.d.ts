import type { AxiosInstance } from 'axios';
import type { CreateAxiosOptions } from './axiosTransform';
export * from './axiosTransform';
/**
 * @description:  axios module
 */
export declare class VAxios {
    private axiosInstance;
    private readonly options;
    constructor(options?: Partial<CreateAxiosOptions>);
    /**
     * @description:  Create axios instance
     */
    private createAxios;
    private getTransform;
    getAxios(): AxiosInstance;
    /**
     * @description: Reconfigure axios
     */
    configAxios(config: CreateAxiosOptions): void;
    /**
     * @description: Set general header
     */
    setHeader(headers: any): void;
    /**
     * @description: Interceptor configuration
     */
    private setupInterceptors;
}
//# sourceMappingURL=Axios.d.ts.map