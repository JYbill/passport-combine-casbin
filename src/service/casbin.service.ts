/**
 * @file: casbin.service.ts
 * @author: xiaoqinvar
 * @desc：获取casbin相关服务
 * @date: 2022-08-12 11:36:19
 */
import { CasbinRule, PrismaClient } from '@prisma/client';
import { ILogger } from '@midwayjs/core';
import { Init, Inject, Logger, Provide } from '@midwayjs/decorator';
import { Enforcer } from 'casbin';
import Role from '../enum/role.enum';

@Provide()
export class CasbinService {
  @Inject('prismaClient')
  prisma: PrismaClient;

  @Inject()
  enforcer: Enforcer;

  @Logger()
  logger: ILogger;

  /**
   * 查询所有规则
   * @returns
   */
  async findAllRules() {
    return this.prisma.casbinRule.findMany();
  }

  /**
   * 新增casbin规则数组
   * @param casbinRules
   * @returns
   */
  async insertRules(casbinRules: CasbinRule[]) {
    return this.prisma.casbinRule.createMany({
      data: [...casbinRules],
    });
  }

  /**
   * 分配普通管理员角色给用户
   * @param username
   * @returns
   */
  async addRoleForUser(username: string) {
    return this.enforcer.addNamedGroupingPolicy('g', username, Role.MANAGER);
  }
}
