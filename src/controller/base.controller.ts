import { ILogger } from '@midwayjs/core';
import { Inject, Logger } from '@midwayjs/decorator';
import { Context } from '@midwayjs/web';

export default class BaseController {
  @Inject()
  ctx: Context;

  @Logger()
  logger: ILogger;
}
