import { OpenEnum } from "./OpenEnum";

export class OpenEnumType {
  private enums: OpenEnum[];
  private name: string;

  constructor(enums: OpenEnum[], name: string) {
    this.enums = enums;
    this.name = name;
  }
}