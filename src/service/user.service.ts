import { IPrismaUpdate } from './../interface';
import { JwtService } from '@midwayjs/jwt';
import { Prisma, PrismaClient } from '@prisma/client';
import { Config, Inject, Provide } from '@midwayjs/decorator';
import { TUser } from '../type';
import { UserVo, UserVoUsername } from '../vo/user.vo';
import { CasbinService } from './casbin.service';
import { BadGatewayError, BadRequestError } from '@midwayjs/core/dist/error/http';
import BaseService from './base.service';
import * as CryptoJS from 'crypto-js';
/**
 * @file: user.service.ts
 * @author: xiaoqinvar
 * @desc：用户相关服务
 * @date: 2022-08-12 16:12:32
 */
@Provide()
export class UserService extends BaseService<UserVo> {
  @Inject()
  casbinService: CasbinService;

  @Inject()
  jwt: JwtService;

  @Config('jwt')
  jwtConfig;

  model = 'user';

  /**
   * 根据名称确定用户
   * @param param0
   */
  async findUserByUsername({ username }: UserVoUsername) {
    return this.findOne({
      where: {
        username,
      },
      select: {
        username: true,
        salt: true,
      },
    });
  }

  /**
   * 加盐进行摘要后，保存用户(注册) 并初始化角色
   * @param user
   * @returns
   */
  async saveUser(user: UserVo) {
    // 二次摘要
    this.encrypt(user);

    // 存储进集合
    const userRet = await this.create({ data: user });
    const addRoleRet = this.casbinService.addRoleForUser(user.username);
    if (!addRoleRet) {
      throw new BadGatewayError('为注册用户初始化角色失败');
    }
    return userRet;
  }

  /**
   * 根据用户名和密码校验用户
   * @param user
   */
  async login(user: UserVo) {
    // 获取盐和密码
    const userRet = await this.findOne({
      where: {
        username: user.username,
      },
      select: {
        nickname: true,
        isAdmin: true,
        username: true,
        salt: true,
        password: true,
      },
    });
    if (!userRet) {
      throw new BadRequestError('账号或密码错误');
    }

    // 盐字符串 to 盐对象
    this.logger.info(userRet);
    const password = CryptoJS.PBKDF2(user.password, userRet.salt, {
      keySize: 128 / 32,
    }).toString();
    if (!Object.is(password, userRet.password)) {
      throw new BadRequestError('账号或密码错误');
    }
    userRet.password = userRet.salt = undefined;
    this.logger.info(userRet);
    // 默认根据jwt策略里配置的密钥自动设置，不用管密钥
    const token = this.jwt.signSync(userRet, {
      expiresIn: this.jwtConfig.expiresIn,
    });
    return token;
  }

  /**
   * 获取所有用户
   * @returns
   */
  async getUsers() {
    return this.findMany({});
  }

  /**
   * 更新单个用户
   * @param user
   * @returns
   */
  async updateUser(id: string, user: UserVo) {
    return this.updateOne({
      where: {
        id,
      },
      data: user,
    });
  }

  /**
   * 是否是管理员
   * @param id
   * @returns
   */
  async isRoot(id: string) {
    const user = await this.findOne({
      where: { id },
      select: { isAdmin: true },
    });
    return user.isAdmin;
  }

  /**
   * 加盐 + 二次摘要
   * @param user
   * @returns
   */
  encrypt(user: UserVo) {
    // 加盐
    const salt = CryptoJS.lib.WordArray.random(128 / 32).toString();
    user.salt = salt;
    // 二次摘要
    user.password = CryptoJS.PBKDF2(user.password, user.salt).toString();
    return user;
  }
}
