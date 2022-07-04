# pullcode
  
pullcode is OpenAPI (aka Swagger) specification compatible typescript http client code generation tool relying on axios. You can configure it to npm scripts to directly generate client code to specified path to easily use. Support Swagger 2 and OpenAPI 3 (aka Swagger 3) in json format.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
### TOC

- [Features](#features)
- [Credits](#credits)
- [Installation](#installation)
- [CLI Options](#cli-options)
- [Generation Rule](#generation-rule)
- [Usage](#usage)
- [Quickstart](#quickstart)
- [More Examples](#more-examples)
  - [Response Error Interceptor](#response-error-interceptor)
  - [Send Requests](#send-requests)
- [Sister Projects](#sister-projects)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Features

1. Totally typescript support. Pullcode generates service class, methods, request body and response body object types based on json formatted Swagger2/OpenAPI3 documentation.
2. Rich and useful configuration options. Pullcode wrapps axios configuration options and add more options for you to elegantly customize requests.
3. Built-in axios request and response interceptors. Request interceptor handles request url rewrite and adds Authorization header. Response interceptor extracts data attribute from raw response. Users can configure additional custom interceptors to do further process. There is no built-in request error and response error interceptors, users should pass their own implementations if necessary.
4. Framework-agnostic. Pullcode can be used with any frontend frameworks.

## Credits

* [commander.js](https://github.com/tj/commander.js)：nodejs command line tool library
* [swagger2openapi](https://github.com/Mermade/oas-kit/blob/main/packages/swagger2openapi/README.md)：convert swagger 2 to OpenAPI 3
* [vue-vben-admin](https://github.com/vbenjs/vue-vben-admin): a modern vue3 admin

## Installation

```shell
npm install --save pullcode
```

NOTE: generated code imports code from pullcode, so pullcode is not only a CLI, but also a npm package, you should use `--save` instead of `--save-dev`.

## CLI Options

```shell
➜  pullcode git:(master) ✗ pullcode -h                                           
Usage: pullcode [options]

Options:
  -o, --output <value>  code output path
  -u, --url <value>     swagger 2.0 or openapi 3.0 json api document download url
  -h, --help            display help for command
```

* output: directories will be recursively created if not exists.

## Generation Rule

Pullcode will check if `BizService.ts` file exists, if exists, skip. Other files will always be overwritten.

## Usage

1. Configure pullcode command into `scripts` attribute in package.json. For example:

```javascript
"scripts": {
  "pull": "pullcode -u https://petstore3.swagger.io/api/v3/openapi.json -o src/api"
},
```

2. Run `npm run pull`

3. Open `BizService.ts` file, fix `defaultOptions` parameters to fit your need.  

```javascript
const defaultOptions: CreateAxiosOptions = {
  requestOptions: {
    apiUrl: '', // same as baseUrl
    urlPrefix: '',
  } as RequestOptions,
}
```

- `apiUrl`: if configured proxy, `apiUrl` should be set to a prefix for matching the proxy.
- `urlPrefix`: should be confirmed with your backend colleagues if there is url prefix to match service name (if the service is behind a gateway) or servlet contxt path (if the service is based on spring boot framework).
- `transform`: set your custom axios interceptors. Normally, you just need to customize response error interceptor.
- `tokenGetter`: set auth token getter function. The function will be called in built-in request interceptor to put token into header.

For example: 

```javascript
import { merge } from 'lodash-es';
import { CreateAxiosOptions, VAxios } from 'pullcode/src/httputil/Axios';
import { useGlobSetting } from '/@/hooks/setting';
import { transform } from '/@/api/interceptor'
import { getToken } from '/@/utils/auth';
import { RequestOptions } from 'pullcode/src/types/axios';

const globSetting = useGlobSetting();

const defaultOptions: CreateAxiosOptions = {
  transform,
  requestOptions: {
    apiUrl: globSetting.apiUrl, // same as baseUrl
    urlPrefix: '/myservice',
  } as RequestOptions,
  tokenGetter: getToken as () => string
}

export class BizService extends VAxios {
  constructor(options?: Partial<CreateAxiosOptions>) {
    super(merge(defaultOptions, options || {}));
  }
}

export default BizService;
```

For other options, please read `CreateAxiosOptions` definition from source code.

4. After above fix, you can import default singleton service instance to components to send http requests.

## Quickstart

Please refer to this example app：[pullcode-quickstart](https://github.com/wubin1989/pullcode/tree/master/examples/pullcode-quickstart)

![petstore](./petstore.png)

## More Examples
### Response Error Interceptor

```javascript
import type { AxiosResponse } from 'axios';
import type { AxiosTransform } from 'pullcode/src/httputil/axiosTransform';
import { checkStatus } from './checkStatus';
import { useMessage } from '/@/hooks/web/useMessage';
import { useErrorLogStoreWithOut } from '/@/store/modules/errorLog';
import { useI18n } from '/@/hooks/web/useI18n';

const { createMessage, createErrorModal } = useMessage();

export const transform: AxiosTransform = {
  /**
   * @description: Response Error Interceptor
   */
  responseInterceptorsCatch: (_: AxiosResponse, error: any) => {
    const { t } = useI18n();
    const errorLogStore = useErrorLogStoreWithOut();
    errorLogStore.addAjaxErrorInfo(error);
    const { response, code, message, config } = error || {};
    const errorMessageMode = config?.requestOptions?.errorMessageMode || 'none';
    const msg: string = response?.data?.error?.message ?? '';
    const err: string = error?.toString?.() ?? '';
    let errMessage = '';

    try {
      if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
        errMessage = t('sys.api.apiTimeoutMessage');
      }
      if (err?.includes('Network Error')) {
        errMessage = t('sys.api.networkExceptionMsg');
      }

      if (errMessage) {
        if (errorMessageMode === 'modal') {
          createErrorModal({ title: t('sys.api.errorTip'), content: errMessage });
        } else if (errorMessageMode === 'message') {
          createMessage.error(errMessage);
        }
        return Promise.reject(error);
      }
    } catch (error) {
      throw new Error(error as unknown as string);
    }

    checkStatus(error?.response?.status, msg, errorMessageMode);
    return Promise.reject(error);
  },
};
```

### Send Requests

```javascript
<script setup lang="ts">
import { petService } from '@/api/PetService';
import { Pet, PetStatusEnum } from '@/api/types';
import { ref } from 'vue';

let loading = ref(true);
let dataSource = ref([] as Pet[]);

petService.getPetFindByStatus({
  status: PetStatusEnum.AVAILABLE,
}).then((resp: Pet[]) => {
  dataSource.value = resp
  loading.value = false
})
</script>
```

## Sister Projects

- [go-doudou](https://github.com/unionj-cloud/go-doudou): OpenAPI 3.0 spec based lightweight microservice framework written in Go. It supports monolith service application as well. Currently, it supports RESTful service only.
