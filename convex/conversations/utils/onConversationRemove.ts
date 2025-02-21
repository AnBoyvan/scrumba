import { Id } from '@/convex/_generated/dataModel';
import { MutationCtx } from '@/convex/_generated/server';
import { onMessageRemove } from '@/convex/messages/utils/onMessageRemove';

export const onConversationRemove = async (
	ctx: MutationCtx,
	conversationId: Id<'conversations'>,
) => {
	const messages = await ctx.db
		.query('messages')
		.withIndex('by_conversation_id', q =>
			q.eq('conversationId', conversationId),
		)
		.collect();

	for (const message of messages) {
		await onMessageRemove(ctx, message);
		await ctx.db.delete(message._id);
	}
};
