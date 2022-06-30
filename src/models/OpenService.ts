import { OpenRoute } from "./OpenRoute";

export class OpenService {
  public name: string | undefined;
  public module: string | undefined;
  public routes: OpenRoute[] | undefined;
  public types: string[] | undefined;
  public doc: string[] | undefined;
}