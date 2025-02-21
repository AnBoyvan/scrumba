import { getAuthUserId } from '@convex-dev/auth/server';
import { ConvexError } from 'convex/values';

import { Id } from '@/convex/_generated/dataModel';
import { MutationCtx } from '@/convex/_generated/server';
import { getMember } from '@/convex/members/utils/getMember';

type Args = {
	name: string;
	workspaceId: Id<'workspaces'>;
};

export const createHandler = async (ctx: MutationCtx, args: Args) => {
	const userId = await getAuthUserId(ctx);

	if (!userId) {
		throw new ConvexError('Unauthorized');
	}

	const member = await getMember(ctx, args.workspaceId, userId);

	if (!member || member.role !== 'admin') {
		throw new ConvexError('Access denied');
	}

	const parsedName = args.name.replace(/\s+/g, '-').toLowerCase();

	const channelId = await ctx.db.insert('channels', {
		name: parsedName,
		workspaceId: args.workspaceId,
	});

	return channelId;
};
