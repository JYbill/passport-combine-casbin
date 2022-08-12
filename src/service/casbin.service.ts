import { PrismaClient } from '@prisma/client';
import { PrismaClientServiceFactory } from '../ioc/PrismaFactory';
import { ILogger } from '@midwayjs/core';
import { Get, Inject, Logger, Provide } from '@midwayjs/decorator';

@Provide()
export class CasbinService {
  @Inject('prismaClient')
  prisma: PrismaClient;

  @Logger()
  logger: ILogger;

  async findAllRules() {
    return this.prisma.casbinRule.findMany();
  }
}
