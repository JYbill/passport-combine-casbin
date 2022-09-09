/**
 * @file: user.controller.ts
 * @author: xiaoqinvar
 * @desc：用户控制器
 * @date: 2022-08-12 17:00:15
 */
import { Body, Controller, Get, Headers, Inject, Logger, Param, Post, Put, Query } from '@midwayjs/decorator';
import { UserService } from './../../service/user.service';
import { BadRequestError } from '@midwayjs/core/dist/error/http';
import { Validate } from '@midwayjs/validate';
import { UserUpdate, UserVo, UserVoUsername } from '../../vo/user.vo';
import BaseController from '../base.controller';
import { Enforcer } from 'casbin';
import { IsRoot } from '../../decorator/isRoot.decorator';

@Controller('/v1/user')
export class UserController extends BaseController {
  @Inject()
  userService: UserService;
  @Inject('enforcer')
  enforcer: Enforcer;

  /**
   * 测试：jwt-passport校验中间件
   * @returns
   */
  @Post('/verify')
  async jwtPassport() {
    return this.ctx.state.user;
  }

  /**
   * 登陆
   * @returns
   */
  @Post('/login')
  async login(@Body() user: UserVo) {
    const token = await this.userService.login(user);
    return token;
  }

  /**
   * 注册账号
   * @returns
   */
  @Post('/register')
  @Validate({
    validationOptions: {
      allowUnknown: true,
    },
  })
  async register(@Body() user: UserVo) {
    // this.logger.info(user);
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
    // this.logger.info(userRet);
    if (!userRet) {
      return '未同名';
    }
    throw new BadRequestError('存在同名');
  }

  /**
   * 获取所有用户
   * @returns
   */
  @Get()
  async getUsers() {
    return this.userService.getUsers();
  }

  /**
   * 更新单个用户
   * @param id
   * @param user
   * @returns
   */
  @Put('/:id')
  @Validate()
  @IsRoot()
  async updateOne(@Param('id') id, @Body() user: UserUpdate) {
    const username = this.ctx.state.user['username'];
    // this.logger.info(id);
    // this.logger.info(user);
    // return this.userService.updateUser(id, user);
    return 'ok.';
  }
}
