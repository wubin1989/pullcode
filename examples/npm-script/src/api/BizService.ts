/**
* Generated by pullcode v1.1.8.
* You can edit it as your need.
*/
import { merge } from 'lodash-es';
import { CreateAxiosOptions, VAxios } from '@/httputil/Axios';
import { RequestOptions } from '@/types/axios';

const defaultOptions: CreateAxiosOptions = {
  requestOptions: {
    apiUrl: '', // same as baseUrl
    urlPrefix: '',
  } as RequestOptions,
}

export class BizService extends VAxios {
  constructor(options?: Partial<CreateAxiosOptions>) {
    super(merge(defaultOptions, options || {}));
  }
}

export default BizService;

