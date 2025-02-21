import { getAuthUserId } from '@convex-dev/auth/server';
import { ConvexError } from 'convex/values';

import { Id } from '@/convex/_generated/dataModel';
import { MutationCtx } from '@/convex/_generated/server';
import { getMember } from '@/convex/members/utils/getMember';

type Args = {
	workspaceId: Id<'workspaces'>;
	memberId: Id<'members'>;
};

export const createOrGetHandler = async (ctx: MutationCtx, args: Args) => {
	const userId = await getAuthUserId(ctx);

	if (userId === null) {
		throw new ConvexError('Unauthorized');
	}

	const currentMember = await getMember(ctx, args.workspaceId, userId);

	const otherMember = await ctx.db.get(args.memberId);

	if (!currentMember || !otherMember) {
		throw new ConvexError('Member not found');
	}

	const existingConversation = await ctx.db
		.query('conversations')
		.filter(q => q.eq(q.field('workspaceId'), args.workspaceId))
		.filter(q =>
			q.or(
				q.and(
					q.eq(q.field('memberOneId'), currentMember._id),
					q.eq(q.field('memberTwoId'), otherMember._id),
				),
				q.and(
					q.eq(q.field('memberOneId'), otherMember._id),
					q.eq(q.field('memberTwoId'), currentMember._id),
				),
			),
		)
		.unique();

	if (existingConversation) {
		return existingConversation._id;
	}

	const conversationId = await ctx.db.insert('conversations', {
		workspaceId: args.workspaceId,
		memberOneId: currentMember._id,
		memberTwoId: otherMember._id,
	});

	return conversationId;
};
