import { Prisma } from '@prisma/client';
import { type } from 'os';

const casbinRule = Prisma.validator<Prisma.CasbinRuleArgs>()({});
export type CasbinRule = Prisma.CasbinRuleGetPayload<typeof casbinRule>;

const user = Prisma.validator<Prisma.UserArgs>()({});
export type TUser = Prisma.UserGetPayload<typeof user>;

// 将范型转为key: boolean类型且可选
export type FieldSelectable<K, V> = Partial<Record<keyof K, V>>;
