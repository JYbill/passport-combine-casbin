import { IPrismaUpdate } from '../interface';
import { JwtService } from '@midwayjs/jwt';
import { Prisma, PrismaClient } from '@prisma/client';
import { Config, Inject, Logger, Provide } from '@midwayjs/decorator';
import { TRoute, TUser } from '../type';
import { UserVo, UserVoUsername } from '../vo/user.vo';
import { CasbinService } from './casbin.service';
import { BadGatewayError, BadRequestError } from '@midwayjs/core/dist/error/http';
import BaseService from './base.service';
import * as CryptoJS from 'crypto-js';
import { ILogger, MidwayWebRouterService } from '@midwayjs/core';

/**
 * @file: user.service.ts
 * @author: xiaoqinvar
 * @desc：初始化相关服务
 * @date: 2022-08-12 16:12:32
 */
@Provide()
export class InitService extends BaseService<TRoute> {
  model = 'Route';
  @Inject()
  webRouterService: MidwayWebRouterService;

  /**
   * 初始化路由
   */
  async initRoute() {
    const routesArr = await this.webRouterService.getFlattenRouterTable();
    const routes = routesArr.map(item => ({ url: item.fullUrl, method: item.requestMethod }));
    for (const route of routes) {
      this.upsert({
        where: {
          method: route.method,
          url: route.url,
        },
        update: route,
        create: route,
      });
    }
  }
}
