import { Id } from '@/convex/_generated/dataModel';
import { MutationCtx } from '@/convex/_generated/server';
import { onConversationRemove } from '@/convex/conversations/utils/onConversationRemove';
import { onMessageRemove } from '@/convex/messages/utils/onMessageRemove';

export const onMemberRemove = async (
	ctx: MutationCtx,
	memberId: Id<'members'>,
	workspaceId: Id<'workspaces'>,
) => {
	const conversations = await ctx.db
		.query('conversations')
		.withIndex('by_workspace_id', q => q.eq('workspaceId', workspaceId))
		.filter(q =>
			q.or(
				q.eq(q.field('memberOneId'), memberId),
				q.eq(q.field('memberTwoId'), memberId),
			),
		)
		.collect();

	for (const conversation of conversations) {
		await onConversationRemove(ctx, conversation._id);
		await ctx.db.delete(conversation._id);
	}

	const messages = await ctx.db
		.query('messages')
		.withIndex('by_member_id', q => q.eq('memberId', memberId))
		.collect();

	for (const message of messages) {
		await onMessageRemove(ctx, message);
		await ctx.db.delete(message._id);
	}

	const reactions = await ctx.db
		.query('reactions')
		.withIndex('by_member_id', q => q.eq('memberId', memberId))
		.collect();

	for (const reaction of reactions) {
		await ctx.db.delete(reaction._id);
	}
};
