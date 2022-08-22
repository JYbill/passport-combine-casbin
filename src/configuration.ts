import { JwtPassportMiddleware } from './middleware/jwt.middleware';
import { CasbinMiddleware } from './middleware/casbin.middleware';
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
import * as jwt from '@midwayjs/jwt';
import * as passport from '@midwayjs/passport';
import * as validate from '@midwayjs/validate';
import { ValidateErrorFilter } from './filter/validate.filter';

@Configuration({
  imports: [egg, jwt, passport, validate],
  importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle implements ILifeCycle {
  @App()
  app: Application;

  @Inject()
  prismaClient: PrismaClient;

  async onReady() {
    //           result -> log -> jwt -> casbin -> request
    // result <- filter <- log <- jwt <- casbin <- request
    this.app.useMiddleware([LogMiddleware, CasbinMiddleware]);
    // jwt认证一定要在casbin授权之前！
    this.app.getMiddleware().insertBefore(JwtPassportMiddleware, 'casbin-middleware');
    // 最前面的中间件
    this.app.getMiddleware().insertFirst(ResultMiddleware);
    this.app.useFilter([DefaultErrorFilter, MidwayHttpErrorFilter, NotFoundFilter, ValidateErrorFilter]);
  }

  async onStop(): Promise<void> {
    // 关闭prisma 连接
    await this.prismaClient.$disconnect();
  }
}
