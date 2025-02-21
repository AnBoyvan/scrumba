import { getAuthUserId } from '@convex-dev/auth/server';
import { ConvexError } from 'convex/values';

import { Id } from '@/convex/_generated/dataModel';
import { MutationCtx } from '@/convex/_generated/server';
import { getMember } from '@/convex/members/utils/getMember';

type Args = {
	messageId: Id<'messages'>;
	value: string;
};

export const toggleHandler = async (ctx: MutationCtx, args: Args) => {
	const userId = await getAuthUserId(ctx);

	if (!userId) {
		throw new ConvexError('Unauthorized');
	}

	const message = await ctx.db.get(args.messageId);

	if (!message) {
		throw new ConvexError('Message not found');
	}

	const member = await getMember(ctx, message.workspaceId, userId);

	if (!member) {
		throw new ConvexError('Access denied');
	}

	const existingMessageReactionFromUser = await ctx.db
		.query('reactions')
		.filter(q =>
			q.and(
				q.eq(q.field('messageId'), args.messageId),
				q.eq(q.field('memberId'), member._id),
				q.eq(q.field('value'), args.value),
			),
		)
		.first();

	if (existingMessageReactionFromUser) {
		await ctx.db.delete(existingMessageReactionFromUser._id);

		return existingMessageReactionFromUser._id;
	} else {
		const newReactionId = await ctx.db.insert('reactions', {
			value: args.value,
			memberId: member._id,
			messageId: message._id,
			workspaceId: message.workspaceId,
		});

		return newReactionId;
	}
};
