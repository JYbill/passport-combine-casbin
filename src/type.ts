import { Prisma } from '@prisma/client';

const casbinRule = Prisma.validator<Prisma.CasbinRuleArgs>()({});
export type CasbinRule = Prisma.CasbinRuleGetPayload<typeof casbinRule>;

const user = Prisma.validator<Prisma.UserArgs>()({});
export type TUser = Prisma.UserGetPayload<typeof user>;

const github = Prisma.validator<Prisma.GithubArgs>()({});
export type TGithub = Prisma.GithubGetPayload<typeof github>;

const route = Prisma.validator<Prisma.RouteArgs>()({});
export type TRoute = Prisma.RouteGetPayload<typeof route>;

// 将范型转为key: boolean类型且可选
export type FieldSelectable<K, V> = Partial<Record<keyof K, V>>;
