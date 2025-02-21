import { getAuthUserId } from '@convex-dev/auth/server';

import { Id } from '@/convex/_generated/dataModel';
import { QueryCtx } from '@/convex/_generated/server';
import { getMember } from '@/convex/members/utils/getMember';

type Args = {
	workspaceId: Id<'workspaces'>;
};

export const getHandler = async (ctx: QueryCtx, args: Args) => {
	const userId = await getAuthUserId(ctx);

	if (userId === null) {
		return [];
	}

	const member = await getMember(ctx, args.workspaceId, userId);

	if (!member) {
		return [];
	}

	const channels = await ctx.db
		.query('channels')
		.withIndex('by_workspace_id', q => q.eq('workspaceId', args.workspaceId))
		.collect();

	return channels;
};
