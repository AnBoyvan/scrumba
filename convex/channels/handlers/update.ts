import { getAuthUserId } from '@convex-dev/auth/server';
import { ConvexError } from 'convex/values';

import { Id } from '@/convex/_generated/dataModel';
import { MutationCtx } from '@/convex/_generated/server';
import { getMember } from '@/convex/members/utils/getMember';

type Args = {
	channelId: Id<'channels'>;
	name: string;
};

export const updateHandler = async (ctx: MutationCtx, args: Args) => {
	const userId = await getAuthUserId(ctx);

	if (!userId) {
		throw new ConvexError('Unauthorized');
	}

	const channel = await ctx.db.get(args.channelId);

	if (!channel) {
		throw new ConvexError('Channel not found');
	}

	const member = await getMember(ctx, channel.workspaceId, userId);

	if (!member || member.role !== 'admin') {
		throw new ConvexError('Access denied');
	}

	const parsedName = args.name.replace(/\s+/g, '-').toLowerCase();

	await ctx.db.patch(args.channelId, {
		name: parsedName,
	});

	return args.channelId;
};
