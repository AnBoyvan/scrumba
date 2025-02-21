import { getAuthUserId } from '@convex-dev/auth/server';

import { Doc, Id } from '@/convex/_generated/dataModel';
import { QueryCtx } from '@/convex/_generated/server';
import { getMember } from '@/convex/members/utils/getMember';
import { populateMember } from '@/convex/members/utils/populateMember';
import { populateReactions } from '@/convex/reactions/utils/populateReactions';
import { populateUser } from '@/convex/users/utils/populateUser';

type Args = {
	messageId: Id<'messages'>;
};

export const getByIdHandler = async (ctx: QueryCtx, args: Args) => {
	const userId = await getAuthUserId(ctx);

	if (userId === null) {
		return null;
	}

	const message = await ctx.db.get(args.messageId);

	if (!message) {
		return null;
	}

	const currentMember = await getMember(ctx, message.workspaceId, userId);

	if (!currentMember) {
		return null;
	}

	const member = await populateMember(ctx, message.memberId);

	if (!member) {
		return null;
	}

	const user = await populateUser(ctx, member.userId);

	if (!user) {
		return null;
	}

	const reactions = await populateReactions(ctx, message._id);

	const reactionsWithCounts = reactions.map(reaction => {
		return {
			...reaction,
			count: reactions.filter(r => r.value === reaction.value).length,
		};
	});

	const dedupedReactions = reactionsWithCounts.reduce(
		(acc, reaction) => {
			const existingReaction = acc.find(r => r.value === reaction.value);

			if (existingReaction) {
				existingReaction.memberIds = Array.from(
					new Set([...existingReaction.memberIds, reaction.memberId]),
				);
			} else {
				acc.push({ ...reaction, memberIds: [reaction.memberId] });
			}

			return acc;
		},
		[] as (Doc<'reactions'> & {
			count: number;
			memberIds: Id<'members'>[];
		})[],
	);

	const reactionsWithoutMemberIdProperty = dedupedReactions.map(
		({ memberId, ...rest }) => rest,
	);

	return {
		...message,
		image: message.image ? await ctx.storage.getUrl(message.image) : undefined,
		member,
		user,
		reactions: reactionsWithoutMemberIdProperty,
	};
};
