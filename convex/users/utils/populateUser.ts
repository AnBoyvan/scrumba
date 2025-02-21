import { Id } from '@/convex/_generated/dataModel';
import { QueryCtx } from '@/convex/_generated/server';

export const populateUser = (ctx: QueryCtx, userId: Id<'users'>) => {
	return ctx.db.get(userId);
};
