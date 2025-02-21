import { Id } from '@/convex/_generated/dataModel';
import { QueryCtx } from '@/convex/_generated/server';
import { populateMember } from '@/convex/members/utils/populateMember';
import { populateUser } from '@/convex/users/utils/populateUser';

export const populateThread = async (
	ctx: QueryCtx,
	messageId: Id<'messages'>,
) => {
	const messages = await ctx.db
		.query('messages')
		.withIndex('by_parent_message_id', q => q.eq('parentMessageId', messageId))
		.collect();

	if (messages.length === 0) {
		return {
			count: 0,
			image: undefined,
			timeStamp: 0,
			name: '',
		};
	}

	const lastMessage = messages[messages.length - 1];
	const lastMessageMember = await populateMember(ctx, lastMessage.memberId);

	if (!lastMessageMember) {
		return {
			count: messages.length,
			image: undefined,
			timeStamp: 0,
			name: '',
		};
	}

	const lastMessageUser = await populateUser(ctx, lastMessageMember.userId);

	return {
		count: messages.length,
		image: lastMessageUser?.image,
		timeStamp: lastMessage._creationTime,
		name: lastMessageUser?.name,
	};
};
