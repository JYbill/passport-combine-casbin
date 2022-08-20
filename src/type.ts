import { Prisma } from '@prisma/client';
import { type } from 'os';

const casbinRule = Prisma.validator<Prisma.CasbinRuleArgs>()({});
export type CasbinRule = Prisma.CasbinRuleGetPayload<typeof casbinRule>;

const user = Prisma.validator<Prisma.UserArgs>()({});
export type TUser = Prisma.UserGetPayload<typeof user>;
