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
   * 默认是不需要执行jwt、casbin中间件，有需要自己配置策略并在default.config文件中删除白名单接口
   * @returns
   */
  @Get('/update')
  async update() {
    await this.enforcer.loadPolicy();
    return 'casbin was updated.';
  }

  @Get('/testWatcher')
  async testWatcher() {
    const addRet = await this.enforcer.addRoleForUser('癞蛤蟆', 'WATCHER');
    const delRet = await this.enforcer.deleteRoleForUser('癞蛤蟆', 'WATCHER');
    return [addRet, delRet];
  }
}
