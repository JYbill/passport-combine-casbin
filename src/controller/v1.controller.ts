import { PrismaClientServiceFactory } from './../ioc/PrismaFactory';
import { ILogger } from '@midwayjs/core';
import { Controller, Get, Inject, Logger } from '@midwayjs/decorator';
import { CasbinService } from '../service/casbin.service';

@Controller('/v1')
export class V1Controller {
  @Inject()
  casbinService: CasbinService;

  @Logger()
  logger: ILogger;

  @Get('/')
  async index() {
    return 'hello v1 api.';
  }

  @Get('/test')
  async test() {
    return this.casbinService.findAllRules();
  }
}
