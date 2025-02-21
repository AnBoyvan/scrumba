import { getAuthUserId } from '@convex-dev/auth/server';

import { Id } from '@/convex/_generated/dataModel';
import { QueryCtx } from '@/convex/_generated/server';
import { getMember } from '@/convex/members/utils/getMember';

type Args = {
	workspaceId: Id<'workspaces'>;
};

export const getAllHandler = async (ctx: QueryCtx, args: Args) => {
	const userId = await getAuthUserId(ctx);

	if (userId === null) {
		return [];
	}

	const currentMember = await getMember(ctx, args.workspaceId, userId);

	if (!currentMember) {
		return [];
	}

	const conversations = await ctx.db
		.query('conversations')
		.withIndex('by_workspace_id', q => q.eq('workspaceId', args.workspaceId))
		.filter(q =>
			q.or(
				q.eq(q.field('memberOneId'), currentMember._id),
				q.eq(q.field('memberTwoId'), currentMember._id),
			),
		)
		.collect();

	const populated = await Promise.all(
		conversations.map(async conv => {
			const memberId =
				conv.memberOneId !== currentMember._id
					? conv.memberOneId
					: conv.memberTwoId;
			const member = await ctx.db.get(memberId);

			if (!member) {
				return null;
			}

			const user = await ctx.db.get(member.userId);

			if (!user) {
				return null;
			}

			return {
				...conv,
				member: {
					...member,
					user,
				},
			};
		}),
	);

	const filtered = populated.filter(conv => conv !== null);

	return filtered;
};
