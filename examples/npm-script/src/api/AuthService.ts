/**
* Generated by pullcode v1.1.8.
* Don't edit!
*
* @module O-auth-controller
*/
import { CreateAxiosOptions } from "@/httputil/axiosTransform";
import BizService from "./BizService";

export class AuthService extends BizService {

  constructor(options?: Partial<CreateAxiosOptions>) {
    super(options);
  }

  /**
  * POST /auth/success
  *
  * @returns Promise<any> OK
  */
  postAuthSuccess(
  ): Promise<any> {
      return this.getAxios().post(`/auth/success`,
          null,
          {
          }
        )
  }

  /**
  * POST /auth/fail
  *
  * @returns Promise<any> 
  */
  postAuthFail(
  ): Promise<any> {
      return this.getAxios().post(`/auth/fail`,
          null,
          {
          }
        )
  }

}

export default AuthService;
  
export function createAuthService(opt?: Partial<CreateAxiosOptions>) {
  return new AuthService(opt);
}

export const authService = createAuthService();

