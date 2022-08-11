import { Controller, Get } from '@midwayjs/decorator';

@Controller('/v1')
export class V1Controller {
  @Get('/')
  async index() {
    return 'hello v1 api.';
  }
}
