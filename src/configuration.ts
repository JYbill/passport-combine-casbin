import { BadRequestError } from '@midwayjs/core/dist/error/http';
import { JwtPassportMiddleware } from './middleware/jwt.middleware';
import { CasbinMiddleware } from './middleware/casbin.middleware';
import { PrismaClient } from '@prisma/client';
import { App, Configuration, Inject, JoinPoint, Logger } from '@midwayjs/decorator';
import { ILifeCycle, IMidwayContainer, IMidwayLogger, MidwayDecoratorService } from '@midwayjs/core';
import { Application } from 'egg';
import { resolve } from 'path';
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
import * as dotenv from 'dotenv';
import * as axios from '@midwayjs/axios';
import * as crossDomain from '@midwayjs/cross-domain';
import { isRootNotice, IS_ROOT_KEY } from './decorator/isRoot.decorator';
import { InitService } from './service/init.service';
import { init } from 'mwts/dist/src/init';

dotenv.config();

@Configuration({
  imports: [egg, jwt, passport, validate, axios, crossDomain],
  importConfigs: [resolve(__dirname, './config')],
})
export class ContainerLifeCycle implements ILifeCycle {
  @App()
  app: Application;

  @Inject()
  prismaClient: PrismaClient;
  @Logger()
  logger: IMidwayLogger;
  @Inject()
  decoratorService: MidwayDecoratorService;

  async onReady(container: IMidwayContainer): Promise<void> {
    // middleware
    //           result -> log -> jwt -> casbin -> request
    // result <- filter <- log <- jwt <- casbin <- request
    this.app.useMiddleware([LogMiddleware, CasbinMiddleware]);
    // jwt认证一定要在casbin授权之前！
    this.app.getMiddleware().insertBefore(JwtPassportMiddleware, 'casbin-middleware');
    // 返回数据一致化的中间件
    this.app.getMiddleware().insertFirst(ResultMiddleware);

    // filters
    this.app.useFilter([DefaultErrorFilter, MidwayHttpErrorFilter, NotFoundFilter, ValidateErrorFilter]);

    // axios interceptors 拦截器
    this.axiosConfigInit(container);

    // 装饰器初始化
    this.decoratorInit();

    // 数据库初始化
    await this.dbInit(container);
  }

  /**
   * axios 配置初始化
   * @param container
   */
  async axiosConfigInit(container: IMidwayContainer) {
    const httpServiceFactory = await container.getAsync(axios.HttpServiceFactory);
    const defaultAxios = httpServiceFactory.get();
    defaultAxios.interceptors.request.use(
      config => {
        return config;
      },
      error => {
        this.logger.error('axios request error.');
        throw new BadRequestError('[axios error] 请求错误');
      }
    );
    defaultAxios.interceptors.response.use(
      config => {
        return config;
      },
      error => {
        this.logger.error('axios response error.');
        throw new BadRequestError(`[axios error] 响应错误 ${error}`);
      }
    );
  }

  /**
   * 构造器初始化
   */
  async decoratorInit() {
    // 实现方法装饰器
    this.decoratorService.registerMethodHandler(IS_ROOT_KEY, isRootNotice);
  }

  /**
   * 数据库初始化
   * @param container midway DI容器
   */
  async dbInit(container: IMidwayContainer) {
    // 初始化路由 in db
    const initService = await container.getAsync<InitService>('initService');
    await initService.initRoute();
    this.logger.info('[Route] init.');
    await initService.initRole();
    this.logger.info('[Role] init.');
  }
  async onStop(): Promise<void> {
    // 关闭prisma 连接
    await this.prismaClient.$disconnect();
  }
}
