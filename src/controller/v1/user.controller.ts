import { ILogger } from '@midwayjs/core';
import { Context } from 'egg';
/**
 * @file: user.controller.ts
 * @author: xiaoqinvar
 * @desc：用户控制器
 * @date: 2022-08-12 17:00:15
 */
import { JwtPassportMiddleware } from './../../middleware/jwt.middleware';
import { Controller, Headers, Inject, Logger, Post } from '@midwayjs/decorator';
import { JwtService } from '@midwayjs/jwt';

@Controller('/v1/user')
export class UserController {
  @Inject()
  ctx: Context;

  @Inject()
  jwt: JwtService;

  @Logger()
  logger: ILogger;

  @Post('/verify')
  async jwtPassport() {
    return this.ctx.state;
  }

  @Post('/login')
  async login() {
    return await this.jwt.sign({
      uname: 'xiaoqinvar',
      age: 22,
      job: 'nodejs stack engineer',
    });
  }
}
