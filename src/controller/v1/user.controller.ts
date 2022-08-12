/**
 * @file: user.controller.ts
 * @author: xiaoqinvar
 * @desc：用户控制器
 * @date: 2022-08-12 17:00:15
 */
import { JwtPassportMiddleware } from './../../middleware/jwt.middleware';
import { Context } from '@midwayjs/core';
import { Controller, Inject, Post } from '@midwayjs/decorator';
import { JwtService } from '@midwayjs/jwt';

@Controller('/v1/user')
export class UserController {
  @Inject()
  ctx: Context;

  @Inject()
  jwt: JwtService;

  @Post('/passport/jwt', { middleware: [JwtPassportMiddleware] })
  async jwtPassport() {
    console.log('jwt user: ', this.ctx['state'].user);
    return this.ctx['state'].user;
  }

  @Post('/jwt')
  async login() {
    return {
      t: await this.jwt.sign({ msg: 'Hello Midway' }),
    };
  }
}
