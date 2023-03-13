/**
* Generated by pullcode v1.1.8.
* Don't edit!
*
* @module Notice-tmpl-controller
*/
import { CreateAxiosOptions } from "pullcode/src/httputil/axiosTransform";
import BizService from "./BizService";
import type {
  NoticeTmplModel,
  NoticeConfigEmail,
  NoticeConfigModel,
  Response,
} from "./types"

export class V1Service extends BizService {

  constructor(options?: Partial<CreateAxiosOptions>) {
    super(options);
  }

  /**
  * POST /v1/notice-tmpl/verify
  *
  * @param payload 
  * @returns Promise<Response> OK
  */
  postV1NoticeTmplVerify(
    payload: string,
  ): Promise<Response> {
      return this.getAxios().post(`/v1/notice-tmpl/verify`,
          payload,
          {
          }
        )
  }

  /**
  * POST /v1/notice-tmpl/edit
  *
  * @param payload 
  * @returns Promise<Response> OK
  */
  postV1NoticeTmplEdit(
    payload: NoticeTmplModel,
  ): Promise<Response> {
      return this.getAxios().post(`/v1/notice-tmpl/edit`,
          payload,
          {
          }
        )
  }

  /**
  * POST /v1/notice-tmpl/delete
  *
  * @param payload 
  * @returns Promise<Response> OK
  */
  postV1NoticeTmplDelete(
    payload: string[],
  ): Promise<Response> {
      return this.getAxios().post(`/v1/notice-tmpl/delete`,
          payload,
          {
          }
        )
  }

  /**
  * POST /v1/notice-tmpl/add
  *
  * @param payload 
  * @returns Promise<Response> OK
  */
  postV1NoticeTmplAdd(
    payload: NoticeTmplModel,
  ): Promise<Response> {
      return this.getAxios().post(`/v1/notice-tmpl/add`,
          payload,
          {
          }
        )
  }

  /**
  * POST /v1/notice-config/emailTest
  *
  * @param payload 
  * @returns Promise<Response> OK
  */
  postV1NoticeConfigEmailTest(
    payload: NoticeConfigEmail,
  ): Promise<Response> {
      return this.getAxios().post(`/v1/notice-config/emailTest`,
          payload,
          {
          }
        )
  }

  /**
  * POST /v1/notice-config/edit
  *
  * @param payload 
  * @returns Promise<Response> OK
  */
  postV1NoticeConfigEdit(
    payload: NoticeConfigModel,
  ): Promise<Response> {
      return this.getAxios().post(`/v1/notice-config/edit`,
          payload,
          {
          }
        )
  }

  /**
  * POST /v1/notice-config/delete
  *
  * @param payload 
  * @returns Promise<Response> OK
  */
  postV1NoticeConfigDelete(
    payload: string[],
  ): Promise<Response> {
      return this.getAxios().post(`/v1/notice-config/delete`,
          payload,
          {
          }
        )
  }

  /**
  * POST /v1/notice-config/add
  *
  * @param payload 
  * @returns Promise<Response> OK
  */
  postV1NoticeConfigAdd(
    payload: NoticeConfigModel,
  ): Promise<Response> {
      return this.getAxios().post(`/v1/notice-config/add`,
          payload,
          {
          }
        )
  }

  /**
  * GET /v1/notice-tmpl/${params.id}
  *
  * @param id 
  * @returns Promise<Response> OK
  */
  getV1NoticeTmplParamsId(
    params: {
      id: string,
    },
  ): Promise<Response> {
      return this.getAxios().get(`/v1/notice-tmpl/${params.id}`,
          {
          }
        )
  }

  /**
  * GET /v1/notice-tmpl/list
  *
  * @param pageSize 
  * @param pageNum 
  * @param name 
  * @param tenantId 
  * @param order 
  * @returns Promise<Response> OK
  */
  getV1NoticeTmplList(
    params: {
      pageSize?: number,
      pageNum?: number,
      name?: string,
      tenantId?: string,
      order?: string,
    },
  ): Promise<Response> {
      return this.getAxios().get(`/v1/notice-tmpl/list`,
          {
            params: {
              pageSize: params.pageSize,
              pageNum: params.pageNum,
              name: params.name,
              tenantId: params.tenantId,
              order: params.order,
            },
          }
        )
  }

  /**
  * GET /v1/notice-config/${params.id}
  *
  * @param id 
  * @returns Promise<Response> OK
  */
  getV1NoticeConfigParamsId(
    params: {
      id: string,
    },
  ): Promise<Response> {
      return this.getAxios().get(`/v1/notice-config/${params.id}`,
          {
          }
        )
  }

  /**
  * GET /v1/notice-config/list
  *
  * @param pageSize 
  * @param pageNum 
  * @param noticeType 
  * @param tenantId 
  * @param order 
  * @returns Promise<Response> OK
  */
  getV1NoticeConfigList(
    params: {
      pageSize?: number,
      pageNum?: number,
      noticeType?: number,
      tenantId?: string,
      order?: string,
    },
  ): Promise<Response> {
      return this.getAxios().get(`/v1/notice-config/list`,
          {
            params: {
              pageSize: params.pageSize,
              pageNum: params.pageNum,
              noticeType: params.noticeType,
              tenantId: params.tenantId,
              order: params.order,
            },
          }
        )
  }

}

export default V1Service;
  
export function createV1Service(opt?: Partial<CreateAxiosOptions>) {
  return new V1Service(opt);
}

export const v1Service = createV1Service();

