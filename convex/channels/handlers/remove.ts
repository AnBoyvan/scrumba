import { getAuthUserId } from '@convex-dev/auth/server';
import { ConvexError } from 'convex/values';

import { Id } from '@/convex/_generated/dataModel';
import { MutationCtx } from '@/convex/_generated/server';
import { getMember } from '@/convex/members/utils/getMember';
import { onMessageRemove } from '@/convex/messages/utils/onMessageRemove';

type Args = {
	channelId: Id<'channels'>;
};

export const removeHandler = async (ctx: MutationCtx, args: Args) => {
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

	const messages = await ctx.db
		.query('messages')
		.withIndex('by_channel_id', q => q.eq('channelId', args.channelId))
		.collect();

	for (const message of messages) {
		await onMessageRemove(ctx, message);
		await ctx.db.delete(message._id);
	}

	await ctx.db.delete(args.channelId);

	return args.channelId;
};
