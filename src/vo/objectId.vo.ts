import { Rule, RuleType } from '@midwayjs/validate';
import { EcmaUtil } from '../utils/ecma.util';

/**
 * @file: objectId.vo.ts
 * @author: xiaoqinvar
 * @desc：校验是否是ObjectId类型
 * @date: 2022-09-11 16:23:40
 */
const checkObjectIdTypeFunc = (value: string[], helpers: RuleType.CustomHelpers<string[]>) => {
  for (const [index, item] of value.entries()) {
    const flag = EcmaUtil.isValidObjectID(item);
    if (!flag) {
      throw new Error(`ids exit other type, index is ${index}`);
    }
  }
  return value;
};

export class ObjectIdArray {
  @Rule(RuleType.custom(checkObjectIdTypeFunc).required())
  ids: string[];
}
