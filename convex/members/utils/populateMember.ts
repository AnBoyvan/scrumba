import { Id } from '@/convex/_generated/dataModel';
import { QueryCtx } from '@/convex/_generated/server';

export const populateMember = (ctx: QueryCtx, memberId: Id<'members'>) => {
	return ctx.db.get(memberId);
};
