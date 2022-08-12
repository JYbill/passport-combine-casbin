import { PrismaClient } from '@prisma/client';
import { App, Configuration, Inject } from '@midwayjs/decorator';
import { ILifeCycle } from '@midwayjs/core';
import { Application } from 'egg';
import { join } from 'path';
import * as egg from '@midwayjs/web';
import { LogMiddleware } from './middleware/logger.middleware';
import { DefaultErrorFilter } from './filter/default.filter';
import { MidwayHttpErrorFilter } from './filter/midway.filter';
import { NotFoundFilter } from './filter/notFound.filter';
import { ResultMiddleware } from './middleware/result.middleware';

@Configuration({
  imports: [egg],
  importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle implements ILifeCycle {
  @App()
  app: Application;

  @Inject()
  prismaClient: PrismaClient;

  async onReady() {
    this.app.useMiddleware([LogMiddleware]);
    // 最前面的中间件
    this.app.getMiddleware().insertFirst(ResultMiddleware);
    this.app.useFilter([
      DefaultErrorFilter,
      MidwayHttpErrorFilter,
      NotFoundFilter,
    ]);
  }

  async onStop(): Promise<void> {
    // 关闭prisma 连接
    await this.prismaClient.$disconnect();
  }
}
