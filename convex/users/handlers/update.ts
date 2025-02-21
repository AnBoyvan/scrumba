import { getAuthUserId } from '@convex-dev/auth/server';
import { ConvexError } from 'convex/values';

import { MutationCtx } from '../../_generated/server';

type Args = {
	name: string;
};

export const updateHandler = async (ctx: MutationCtx, args: Args) => {
	const userId = await getAuthUserId(ctx);

	if (!userId) {
		throw new ConvexError('Unauthorized');
	}

	await ctx.db.patch(userId, { name: args.name });

	return userId;
};
