/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Generated by pullcode v1.2.1.
 * Don't edit!
 *
 * @module Book
 */
import { CreateAxiosOptions } from "@/httputil/axiosTransform";
import qs from "qs";
import BizService from "./BizService";
import type {
  GetBookNotFoundExceptionResp,
  GetBookPageResp,
  Page,
  PostBookPageReq,
  PostBookPageResp,
} from "./types";

export class BookService extends BizService {
  constructor(options?: Partial<CreateAxiosOptions>) {
    super(options);
  }

  /**
   * GET /book/not/found/exception
   *
   * You can define your service methods as your need. Below is an example.
   * You can also add annotations here like @role(admin) to add metadata to routes for
   * implementing your own middlewares
   * @returns Promise<GetBookNotFoundExceptionResp>
   */
  getBookNotFoundException(): Promise<GetBookNotFoundExceptionResp> {
    return this.getAxios().get(`/book/not/found/exception`, {});
  }

  /**
   * GET /book/page
   *
   * @param name
   * @param author
   * @param page
   * @returns Promise<GetBookPageResp>
   */
  getBookPage(params: {
    name: string;
    author: string;
    page: Page;
  }): Promise<GetBookPageResp> {
    return this.getAxios().get(`/book/page`, {
      params: {
        name: params.name,
        author: params.author,
        page: params.page,
      },
      paramsSerializer: (params) => qs.stringify(params),
    });
  }

  /**
   * POST /book/page
   *
   * @param payload
   * @returns Promise<PostBookPageResp>
   */
  postBookPage(payload: PostBookPageReq): Promise<PostBookPageResp> {
    const headers: Record<string, string> = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    return this.getAxios().post(`/book/page`, qs.stringify(payload), {
      headers,
    });
  }
}

export default BookService;

export function createBookService(opt?: Partial<CreateAxiosOptions>) {
  return new BookService(opt);
}

export const bookService = createBookService();