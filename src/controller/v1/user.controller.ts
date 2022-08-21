/**
 * @file: user.controller.ts
 * @author: xiaoqinvar
 * @desc：用户控制器
 * @date: 2022-08-12 17:00:15
 */
import { Body, Controller, Get, Headers, Inject, Logger, Post, Query } from '@midwayjs/decorator';
import { JwtService } from '@midwayjs/jwt';
import { UserService } from './../../service/user.service';
import { ILogger } from '@midwayjs/core';
import { Context } from 'egg';
import { BadRequestError } from '@midwayjs/core/dist/error/http';
import { Validate } from '@midwayjs/validate';
import { UserVo, UserVoUsername } from '../../vo/user.vo';
import CryptoJS = require('crypto-js');

@Controller('/v1/user')
export class UserController {
  @Inject()
  ctx: Context;

  @Inject()
  jwt: JwtService;

  @Inject()
  userService: UserService;

  @Logger()
  logger: ILogger;

  /**
   * 测试：jwt-passport校验中间件
   * @returns
   */
  @Post('/verify')
  async jwtPassport() {
    return this.ctx.state;
  }

  /**
   * 登陆
   * @returns
   */
  @Post('/login')
  async login(@Body() user: UserVo) {
    const userRet = await this.userService.findUserByUsernameAndPassword(user);
    if (!userRet) {
      throw new BadRequestError('账号或密码错误');
    }
    return this.jwt.sign(user);
  }

  /**
   * 注册账号
   * @returns
   */
  @Post('/register')
  @Validate()
  async register(@Body() user: UserVo) {
    // 先检测同名
    await this.checkSameUsername(user);
    // 再注册
    const saveRet = this.userService.saveUser(user);
    if (saveRet) {
      return '注册成功';
    }
    throw new BadRequestError('注册失败.');
  }

  /**
   * 检查用户名是否同名
   * @param user
   * @returns
   */
  @Get('/checkUsername')
  @Validate()
  async checkUsername(@Query() user: UserVoUsername) {
    return this.checkSameUsername(user);
  }

  /**
   * 静态代理，避免接口构造器干扰
   * 根据参数获取同名用户
   * @param user
   * @returns
   */
  async checkSameUsername(user: UserVoUsername) {
    const userRet = await this.userService.findUserByUsername(user);
    this.logger.info(userRet);
    if (!userRet) {
      return '未同名';
    }
    throw new BadRequestError('存在同名');
  }
}
