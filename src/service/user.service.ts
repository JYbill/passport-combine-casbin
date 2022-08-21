import { Prisma, PrismaClient } from '@prisma/client';
import { Inject, Provide } from '@midwayjs/decorator';
import { TUser } from '../type';
import { UserVo, UserVoUsername } from '../vo/user.vo';
import { CasbinService } from './casbin.service';
import { BadGatewayError } from '@midwayjs/core/dist/error/http';
import BaseService from './base.service';

/**
 * @file: user.service.ts
 * @author: xiaoqinvar
 * @desc：用户相关服务
 * @date: 2022-08-12 16:12:32
 */
@Provide()
export class UserService extends BaseService<TUser> {
  @Inject()
  casbinService: CasbinService;

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
   * 保存用户(注册) 并初始化角色
   * @param user
   * @returns
   */
  async saveUser(user: UserVo) {
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
  findUserByUsernameAndPassword(user: UserVo) {
    return this.findOne({
      where: {
        username: user.username,
        password: user.password,
      },
      select: {
        username: true,
        salt: true,
      },
    });
  }
}
