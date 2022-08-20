import { TUser } from './../type';
/**
 * @file: User.vo.ts
 * @author: xiaoqinvar
 * @desc：User VO模型
 * @date: 2022-08-20 17:32:31
 */
import { Rule, RuleType } from '@midwayjs/validate';

export default class UserVo implements TUser {
  @Rule(RuleType.string())
  id: string;
  @Rule(RuleType.string().min(3).max(10).required())
  username: string;
  @Rule(RuleType.string().min(7).max(15))
  password: string;
}
