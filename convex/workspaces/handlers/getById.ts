import { getAuthUserId } from '@convex-dev/auth/server';
import { ConvexError } from 'convex/values';

import { Id } from '@/convex/_generated/dataModel';
import { QueryCtx } from '@/convex/_generated/server';
import { getMember } from '@/convex/members/utils/getMember';

type Args = {
	workspaceId: Id<'workspaces'>;
};

export const getByIdHandler = async (ctx: QueryCtx, args: Args) => {
	const userId = await getAuthUserId(ctx);

	if (!userId) {
		throw new ConvexError('Unauthorized');
	}

	const member = await getMember(ctx, args.workspaceId, userId);

	if (!member) {
		return null;
	}

	return await ctx.db.get(args.workspaceId);
};
