/**
 * @file: casbin.controller.ts
 * @author: xiaoqinvar
 * @desc：casbin 控制器
 * @date: 2022-08-12 11:37:57
 */
import { RedisWatcher } from '@casbin/redis-watcher';
import { ILogger } from '@midwayjs/core';
import { Body, Controller, Get, Inject, Logger, Post, Query } from '@midwayjs/decorator';
import { CasbinRule } from '@prisma/client';
import { Enforcer, newModelFromString } from 'casbin';
import { CasbinService } from '../../service/casbin.service';
import BaseController from '../base.controller';

@Controller('/v1/casbin')
export class CasbinController extends BaseController {
  @Inject()
  casbinService: CasbinService;

  @Inject()
  enforcer: Enforcer;

  @Get('/users')
  async index(@Query('roleName') roleName: string) {
    return this.casbinService.getUsersByRole(roleName);
  }

  /**
   * 当你直接修改数据库casbin_rule的数据后，你可能需要load一下策略
   * @returns
   */
  @Get('/update')
  async testWatcher() {
    await this.enforcer.loadPolicy();
    return 'casbin was updated.';
  }
}
