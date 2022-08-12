import { Prisma } from '@prisma/client';

const casbinRule = Prisma.validator<Prisma.CasbinRuleArgs>()({});
export type CasbinRule = Prisma.CasbinRuleGetPayload<typeof casbinRule>;
