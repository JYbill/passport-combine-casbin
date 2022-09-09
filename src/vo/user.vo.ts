import { TGithub } from './../type';
/**
 * @file: User.vo.ts
 * @author: xiaoqinvar
 * @desc：User VO模型
 * @date: 2022-08-20 17:32:31
 */
import { Rule, RuleType } from '@midwayjs/validate';
import { TUser } from './../type';

/**
 * 所有前端可以传递参数都都进行校验
 */
export class UserVo implements TUser {
  @Rule(RuleType.string())
  id: string;

  @Rule(RuleType.string().min(3).max(10).required())
  username: string;

  @Rule(RuleType.string().min(7).max(15).required())
  password: string;

  @Rule(RuleType.string().min(2).max(10).required())
  nickname: string;

  isAdmin: boolean;

  salt: string; // 后台生成，不需要前端传递

  gmt_create: Date;

  gmt_modified: Date;
}

export class UserUpdate implements TUser {
  // 禁止修改
  @Rule(RuleType.forbidden())
  id: string;

  @Rule(RuleType.forbidden())
  username: string;

  @Rule(RuleType.string().min(3).max(10))
  nickname: string;

  @Rule(RuleType.forbidden())
  password: string;

  @Rule(RuleType.forbidden())
  salt: string;

  @Rule(RuleType.boolean().allow())
  isAdmin: boolean;

  @Rule(RuleType.forbidden())
  gmt_create: Date;

  @Rule(RuleType.forbidden())
  gmt_modified: Date;
}

/**
 * 校验部分
 */
export class UserVoUsername implements Partial<TUser> {
  @Rule(RuleType.string().min(3).max(10).required())
  username: string;
}
