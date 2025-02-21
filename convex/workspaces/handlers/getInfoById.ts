import { getAuthUserId } from '@convex-dev/auth/server';

import { Id } from '@/convex/_generated/dataModel';
import { QueryCtx } from '@/convex/_generated/server';
import { getMember } from '@/convex/members/utils/getMember';

type Args = {
	workspaceId: Id<'workspaces'>;
};

export const getInfoByIdHandler = async (ctx: QueryCtx, args: Args) => {
	const userId = await getAuthUserId(ctx);

	if (!userId) {
		return null;
	}

	const member = await getMember(ctx, args.workspaceId, userId);

	const workspace = await ctx.db.get(args.workspaceId);

	return {
		name: workspace?.name,
		isMember: !!member,
	};
};
