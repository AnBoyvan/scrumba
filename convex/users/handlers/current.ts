import { getAuthUserId } from '@convex-dev/auth/server';

import { QueryCtx } from '@/convex/_generated/server';

export const currentHandler = async (ctx: QueryCtx) => {
	const userId = await getAuthUserId(ctx);

	if (userId === null) {
		return null;
	}

	return await ctx.db.get(userId);
};
