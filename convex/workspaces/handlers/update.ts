import { getAuthUserId } from '@convex-dev/auth/server';
import { ConvexError } from 'convex/values';

import { Id } from '@/convex/_generated/dataModel';
import { MutationCtx } from '@/convex/_generated/server';
import { getMember } from '@/convex/members/utils/getMember';

type Args = {
	workspaceId: Id<'workspaces'>;
	name: string;
};

export const updateHandler = async (ctx: MutationCtx, args: Args) => {
	const userId = await getAuthUserId(ctx);

	if (!userId) {
		throw new ConvexError('Unauthorized');
	}

	const member = await getMember(ctx, args.workspaceId, userId);

	if (!member || member.role !== 'admin') {
		throw new ConvexError('Access denied');
	}

	await ctx.db.patch(args.workspaceId, { name: args.name });

	return args.workspaceId;
};
