/**
 * @file: casbin.controller.ts
 * @author: xiaoqinvar
 * @desc：casbin 控制器
 * @date: 2022-08-12 11:37:57
 */
import { ILogger } from '@midwayjs/core';
import { Body, Controller, Get, Inject, Logger, Post } from '@midwayjs/decorator';
import { CasbinRule } from '@prisma/client';
import { CasbinService } from '../../service/casbin.service';

@Controller('/v1/casbin')
export class CasbinController {
  @Inject()
  casbinService: CasbinService;

  @Logger()
  logger: ILogger;
}
