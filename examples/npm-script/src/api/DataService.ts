/**
* Generated by pullcode v1.1.8.
* Don't edit!
*
* @module Data-operation-controller
*/
import { CreateAxiosOptions } from "pullcode/src/httputil/axiosTransform";
import BizService from "./BizService";
import type {
  Response,
} from "./types"

export class DataService extends BizService {

  constructor(options?: Partial<CreateAxiosOptions>) {
    super(options);
  }

  /**
  * GET /data/operation/list/get
  *
  * @returns Promise<Response> OK
  */
  getDataOperationListGet(
  ): Promise<Response> {
      return this.getAxios().get(`/data/operation/list/get`,
          {
          }
        )
  }

}

export default DataService;
  
export function createDataService(opt?: Partial<CreateAxiosOptions>) {
  return new DataService(opt);
}

export const dataService = createDataService();

