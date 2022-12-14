/**
 * @file: base.service.ts
 * @author: xiaoqinvar
 * @desc：基础service抽象父类
 * @date: 2022-08-21 16:30:42
 */
import { ILogger } from '@midwayjs/core';
import { Inject, sleep } from '@midwayjs/decorator';
import { prisma, Prisma, PrismaClient, PrismaPromise } from '@prisma/client';
import { Context } from 'egg';
import { IPrismaCreate, IPrismaDelete, IPrismaSearch, IPrismaUpdate, IPrismaUpsert } from '../interface';
import { FieldSelectable, TUser } from '../type';
import { UserVo } from '../vo/user.vo';

export default abstract class BaseService<T> {
  @Inject()
  ctx: Context;

  @Inject()
  logger: ILogger;

  @Inject('prismaClient')
  prismaClient: PrismaClient;

  abstract model: string;

  defaultUserSelect: FieldSelectable<TUser, boolean> = {
    id: true,
    username: true,
    nickname: true,
    isAdmin: true,
    gmt_create: true,
    gmt_modified: true,
  };

  /**
   * 获取第一个查询到的对象并返回
   * @returns
   * @param args
   */
  async findOne(args: IPrismaSearch<T>): Promise<T> {
    if (this.model === 'user') {
      const select = args.select as FieldSelectable<UserVo, boolean>;
      if (!args.select) {
        (args.select as FieldSelectable<UserVo, boolean>) = this.defaultUserSelect;
      }
    }

    return this.prismaClient[this.model].findFirst(args);
  }

  /**
   * 根据条件查询所有
   * @param args
   */
  async findMany(args: IPrismaSearch<T>) {
    if (this.model === 'user') {
      const select = args.select as FieldSelectable<UserVo, boolean>;
      if (!args.select) {
        (args.select as FieldSelectable<UserVo, boolean>) = this.defaultUserSelect;
      }
    }
    return this.prismaClient[this.model].findMany(args);
  }

  /**
   * 新增
   * @returns
   * @param arg
   */
  async create(arg: IPrismaCreate<T>): Promise<T> {
    return this.prismaClient[this.model].create(arg);
  }

  /**
   * 新增一个
   * @returns
   * @param args
   */
  async updateOne(args: IPrismaUpdate<T>): Promise<T> {
    if (this.model === 'user' && !args.select) {
      (args.select as FieldSelectable<UserVo, boolean>) = this.defaultUserSelect;
    }
    return this.prismaClient[this.model].update(args);
  }

  /**
   * 更新/创建字段
   * @param arg
   * @returns
   */
  async upsert(arg: IPrismaUpsert<T>): Promise<T> {
    return this.prismaClient[this.model].upsert(arg);
  }

  /**
   * 删除单个
   * @param args
   * @returns
   */
  async deleteOne(args: IPrismaDelete<T>): Promise<T> {
    return this.prismaClient[this.model].delete(args);
  }

  /**
   * 删除多个
   * @param args
   * @returns
   */
  async deleteMany(args: IPrismaDelete<T>): Promise<Prisma.BatchPayload> {
    return this.prismaClient[this.model].deleteMany(args);
  }
}
