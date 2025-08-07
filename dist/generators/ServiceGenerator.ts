import * as ejs from 'ejs';
import { version } from '../version';
import * as path from 'path';
import * as fs from 'fs';
import { OpenService } from 'src/models/OpenService';
import * as _ from 'lodash';
import * as prettier from 'prettier'

export class ServiceGenerator {
  public service: OpenService | undefined;
  public outputDir: string = '';
  private static template: string = 'Service.ts.ejs';

  public generate() {
    if (!this.service) {
      return
    }
    const name = _.upperFirst(this.service.name);
    let out = path.join(this.outputDir, name + ".ts")
    if (!path.isAbsolute(out)) {
      out = path.resolve(process.cwd(), out)
    }
    if (fs.existsSync(out)) {
      console.log(`file ${out} will be overwritten...`)
    }
    const module = _.upperFirst(this.service.module);
    ejs.renderFile(path.resolve(__dirname, ServiceGenerator.template), {
      version,
      types: this.service.types,
      name,
      module,
      routes: this.service.routes,
      _,
    }, {
    }, function (err, str) {
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