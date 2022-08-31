/**
 * @file: base.service.ts
 * @author: xiaoqinvar
 * @desc：基础service抽象父类
 * @date: 2022-08-21 16:30:42
 */
import { ILogger } from '@midwayjs/core';
import { Inject } from '@midwayjs/decorator';
import { Prisma, PrismaClient } from '@prisma/client';
import { Context } from 'egg';
import { FieldSelectable } from '../type';
import { UserVo } from '../vo/user.vo';

export default abstract class BaseService<T> {
  @Inject()
  ctx: Context;

  @Inject()
  logger: ILogger;

  @Inject('prismaClient')
  prismaClient: PrismaClient;

  abstract model: string;

  /**
   * 获取第一个查询到的对象并返回
   * @param data
   * @returns
   */
  async findOne(data: { where: Partial<T>; select?: FieldSelectable<T, boolean> }): Promise<T> {
    // 不存在select
    if (!data.select) {
      return this.prismaClient[this.model].findFirst(data);
    }

    // 存在select增加固定条件
    // 默认返回需要的指定字段
    (data.select as FieldSelectable<any, boolean>).id = true;

    // 特定表/集合中不要返回的字段
    if (this.model === 'user' && (data.select as FieldSelectable<UserVo, boolean>).password === undefined) {
      (data.select as FieldSelectable<UserVo, boolean>).password = false;
    }

    return this.prismaClient[this.model].findFirst(data);
  }

  /**
   * 新增
   * @param data
   * @returns
   */
  async create(data: { data: Partial<T> }): Promise<T> {
    return this.prismaClient[this.model].create(data);
  }
}
