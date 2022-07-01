import * as ejs from 'ejs';
import { version } from '../version';
import * as path from 'path';
import * as fs from 'fs';
import * as _ from 'lodash';
import { OpenType } from 'src/models/OpenType';

export class TypesGenerator {
  public types: OpenType[] | undefined;
  public outputDir: string = '';
  private static template: string = 'types.ts.ejs';

  public generate() {
    if (!this.types || !this.types.length) {
      return
    }
    let out = path.join(this.outputDir, "types.ts")
    if (!path.isAbsolute(out)) {
      out = path.resolve(process.cwd(), out)
    }
    if (fs.existsSync(out)) {
      console.log(`file ${out} will be overwritten...`)
    }
    ejs.renderFile(path.resolve(__dirname, TypesGenerator.template), {
      version,
      types: this.types,
    }, {
    }, function (err, str) {
      if (err) {
        throw err;
      }
      fs.writeFile(out, str, function (err) {
        if (err) {
          throw err;
        }
        console.log(`file ${out} is generated`)
      })
    });
  }
}