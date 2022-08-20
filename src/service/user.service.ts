import { PrismaClient } from '@prisma/client';
import { Inject, Provide } from '@midwayjs/decorator';
import { TUser } from '../type';
import UserVo from '../vo/user.vo';
import { CasbinService } from './casbin.service';
import { BadGatewayError } from '@midwayjs/core/dist/error/http';

/**
 * @file: user.service.ts
 * @author: xiaoqinvar
 * @desc：用户相关服务
 * @date: 2022-08-12 16:12:32
 */
@Provide()
export class UserService {
  @Inject('prismaClient')
  prismaClient: PrismaClient;

  @Inject()
  casbinService: CasbinService;

  /**
   * 根据名称确定用户
   * @param param0
   */
  async findUserByUsername({ username }: UserVo) {
    return this.prismaClient.user.findFirst({
      where: {
        username,
      },
    });
  }

  /**
   * 保存用户(注册) 并初始化角色
   * @param user
   * @returns
   */
  async saveUser(user: UserVo) {
    const userRet = await this.prismaClient.user.create({
      data: user,
    });
    const addRoleRet = this.casbinService.addRoleForUser(user.username);
    if (!addRoleRet) {
      throw new BadGatewayError('为注册用户初始化角色失败');
    }
    return userRet;
  }
}
