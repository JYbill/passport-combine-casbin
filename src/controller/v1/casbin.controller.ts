/**
 * @file: casbin.controller.ts
 * @author: xiaoqinvar
 * @desc：casbin 控制器
 * @date: 2022-08-12 11:37:57
 */
import { ILogger } from '@midwayjs/core';
import { Body, Controller, Get, Inject, Logger, Post, Query } from '@midwayjs/decorator';
import { CasbinRule } from '@prisma/client';
import { CasbinService } from '../../service/casbin.service';
import BaseController from '../base.controller';

@Controller('/v1/casbin')
export class CasbinController extends BaseController {
  @Inject()
  casbinService: CasbinService;

  @Get('/users')
  async index(@Query('roleName') roleName: string) {
    return this.casbinService.getUsersByRole(roleName);
  }
}
