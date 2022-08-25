import { ServiceFactory, ILogger } from '@midwayjs/core';
import { Config, Init, Logger, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { PrismaClient } from '@prisma/client';

@Provide('prismaClientServiceFactory')
@Scope(ScopeEnum.Singleton)
export class PrismaClientServiceFactory extends ServiceFactory<PrismaClient> {
  @Config('prismaConfig')
  prismaConfig;

  @Logger()
  logger: ILogger;

  @Init()
  async init() {
    await this.initClients(this.prismaConfig);
    const prismaClient = this.get();

    // 初始化部分表

    // TODO: 查询初始化数据是否存在？不存在 -> 插入
    // unique会报错
    // const initRole = await prismaClient.role.createMany({
    //   data: [
    //     { roleName: 'MANAGER', description: '管理员角色' },
    //     { roleName: 'USER', description: '用户角色' },
    //   ],
    // });
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
