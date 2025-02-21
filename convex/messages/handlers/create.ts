import { getAuthUserId } from '@convex-dev/auth/server';
import { ConvexError } from 'convex/values';

import { Id } from '@/convex/_generated/dataModel';
import { MutationCtx } from '@/convex/_generated/server';
import { getMember } from '@/convex/members/utils/getMember';

type Args = {
	body: string;
	image?: Id<'_storage'>;
	workspaceId: Id<'workspaces'>;
	channelId?: Id<'channels'>;
	parentMessageId?: Id<'messages'>;
	conversationId?: Id<'conversations'>;
};

export const createHandler = async (ctx: MutationCtx, args: Args) => {
	const userId = await getAuthUserId(ctx);

	if (!userId) {
		throw new ConvexError('Unauthorized');
	}

	const member = await getMember(ctx, args.workspaceId, userId);

	if (!member) {
		throw new ConvexError('Access denied');
	}

	let _conversationId = args.conversationId;

	if (!args.conversationId && !args.channelId && args.parentMessageId) {
		const parentMessage = await ctx.db.get(args.parentMessageId);

		if (!parentMessage) {
			throw new ConvexError('Parent message not found');
		}

		_conversationId = parentMessage.conversationId;
	}

	const messageId = await ctx.db.insert('messages', {
		memberId: member._id,
		body: args.body,
		image: args.image,
		channelId: args.channelId,
		conversationId: _conversationId,
		workspaceId: args.workspaceId,
		parentMessageId: args.parentMessageId,
	});

	return messageId;
};
