export class OpenTypeConstants {
  public static ANY = "any";
  public static FORMDATA = "FormData";
  public static STRING = "string";
  public static BLOB = "Blob";
  public static NUMBER = "number";
  public static BOOLEAN = "boolean";

  public static values = () => [OpenTypeConstants.ANY, OpenTypeConstants.NUMBER, OpenTypeConstants.STRING, OpenTypeConstants.BOOLEAN]
}