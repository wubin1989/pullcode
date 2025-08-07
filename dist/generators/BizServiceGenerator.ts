import * as ejs from 'ejs';
import { version } from '../version';
import * as path from 'path';
import * as fs from 'fs';
import * as prettier from 'prettier'

export class BizServiceGenerator {
  public server: string | undefined;
  public outputDir: string = '';
  private static filename: string = 'BizService.ts';
  private static template: string = 'BizService.ts.ejs';

  public generate() {
    let out = path.join(this.outputDir, BizServiceGenerator.filename)
    if (!path.isAbsolute(out)) {
      out = path.resolve(process.cwd(), out)
    }
    if (fs.existsSync(out)) {
      console.log(`file ${out} exists, skip`)
      return
    }
    ejs.renderFile(path.resolve(__dirname, BizServiceGenerator.template), {
      version,
    }, {}, function (err, str) {
      if (err) {
        throw err;
      }
      fs.writeFile(out, prettier.format(str, { parser: "typescript" }), function (err) {
        if (err) {
          throw err;
        }
        console.log(`file ${out} is generated`)
      })
    });
  }
}