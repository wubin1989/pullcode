import type { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios';
import type { CreateAxiosOptions } from './axiosTransform';
import axios from 'axios';
import { cloneDeep, isFunction, isObject, isString, merge } from 'lodash-es';
import { formatRequestDate, joinTimestamp } from './helper';
import { RequestEnum } from '../enums/httpEnum';
import { Recordable } from '../types/axios';

export * from './axiosTransform';

const defaultOptions: CreateAxiosOptions = {
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
}

/**
 * @description:  axios module
 */
export class VAxios {
  private axiosInstance: AxiosInstance;
  private readonly options: CreateAxiosOptions;

  constructor(options?: Partial<CreateAxiosOptions>) {
    this.options = merge(cloneDeep(defaultOptions), options || {});
    this.axiosInstance = axios.create(options);
    this.setupInterceptors();
  }

  /**
   * @description:  Create axios instance
   */
  private createAxios(config: CreateAxiosOptions): void {
    this.axiosInstance = axios.create(config);
  }

  private getTransform() {
    const { transform } = this.options;
    return transform;
  }

  getAxios(): AxiosInstance {
    return this.axiosInstance;
  }

  /**
   * @description: Reconfigure axios
   */
  configAxios(config: CreateAxiosOptions) {
    if (!this.axiosInstance) {
      return;
    }
    this.createAxios(config);
  }

  /**
   * @description: Set general header
   */
  setHeader(headers: any): void {
    if (!this.axiosInstance) {
      return;
    }
    Object.assign(this.axiosInstance.defaults.headers, headers);
  }

  /**
   * @description: Interceptor configuration
   */
  private setupInterceptors() {
    const {
      requestInterceptors,
      requestInterceptorsCatch,
      responseInterceptors,
      responseInterceptorsCatch,
    } = this.getTransform() || {};

    // Request interceptor configuration processing
    this.axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
      const { requestOptions, axiosCanceler, tokenGetter } = this.options;
      if (requestOptions && isObject(requestOptions) && Object.keys(requestOptions).length) {
        const { apiUrl, joinPrefix, formatDate, joinTime = true, urlPrefix } = requestOptions;
        if (joinPrefix) {
          config.url = `${urlPrefix}${config.url}`;
        }
        if (apiUrl && isString(apiUrl)) {
          config.url = `${apiUrl}${config.url}`;
        }
        const params = config.params || {};
        const data = config.data || false;
        formatDate && data && !isString(data) && formatRequestDate(data);
        if (config.method?.toUpperCase() === RequestEnum.GET) {
          if (!isString(params)) {
            // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
            config.params = Object.assign(params || {}, joinTimestamp(joinTime, false));
          } else {
            // 兼容restful风格
            config.url = config.url + params + `${joinTimestamp(joinTime, true)}`;
            config.params = undefined;
          }
        }
      }
      // If cancel repeat request is turned on, then cancel repeat request is prohibited
      const {
        // @ts-ignore
        headers: { ignoreCancelToken },
      } = config;

      const ignoreCancel =
        ignoreCancelToken !== undefined
          ? ignoreCancelToken
          : this.options.requestOptions?.ignoreCancelToken;

      !ignoreCancel && axiosCanceler && axiosCanceler.addPending(config);
      // 请求之前处理config
      if (tokenGetter && isFunction(tokenGetter)) {
        const token = tokenGetter();
        if (token && (config as Recordable)?.requestOptions?.withToken !== false) {
          // jwt token
          (config as Recordable).headers.Authorization = this.options.authenticationScheme
            ? `${this.options.authenticationScheme} ${token}`
            : token;
        }
      }
      if (requestInterceptors && isFunction(requestInterceptors)) {
        config = requestInterceptors(config, this.options);
      }
      return config;
    }, undefined);

    // Request interceptor error capture
    requestInterceptorsCatch &&
      isFunction(requestInterceptorsCatch) &&
      this.axiosInstance.interceptors.request.use(undefined, requestInterceptorsCatch);

    // Response result interceptor processing
    this.axiosInstance.interceptors.response.use((res: AxiosResponse<any>) => {
      const { axiosCanceler } = this.options;
      res && axiosCanceler && axiosCanceler.removePending(res.config);
      if (responseInterceptors && isFunction(responseInterceptors)) {
        if (this.options.requestOptions && this.options.requestOptions.isReturnNativeResponse) {
          return responseInterceptors(res, this.options)
        }
        return responseInterceptors(res.data, this.options)
      }
      if (this.options.requestOptions && this.options.requestOptions.isReturnNativeResponse) {
        return res
      }
      return res.data
    }, undefined);

    // Response result interceptor error capture
    responseInterceptorsCatch &&
      isFunction(responseInterceptorsCatch) &&
      this.axiosInstance.interceptors.response.use(undefined, (error) => {
        // @ts-ignore
        return responseInterceptorsCatch(this.axiosInstance, error);
      });
  }
}
