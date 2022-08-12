import { ServiceFactory } from '@midwayjs/core';
import { Config, Init, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { PrismaClient } from '@prisma/client';

@Provide('prismaClientServiceFactory')
@Scope(ScopeEnum.Singleton)
export class PrismaClientServiceFactory extends ServiceFactory<PrismaClient> {
  @Config('prismaConfig')
  prismaConfig;

  @Init()
  async init() {
    await this.initClients(this.prismaConfig);
  }

  /**
   * 创建客户端
   * @param config
   * @returns
   */
  protected createClient(config: any): PrismaClient {
    const prisma = new PrismaClient(config);
    return prisma;
  }

  /**
   * 获取服务工厂名
   * @returns
   */
  getName() {
    return 'prismaClient';
  }
}
