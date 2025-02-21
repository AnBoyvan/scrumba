import { getAuthUserId } from '@convex-dev/auth/server';
import { PaginationOptions } from 'convex/server';
import { ConvexError } from 'convex/values';

import { Doc, Id } from '@/convex/_generated/dataModel';
import { QueryCtx } from '@/convex/_generated/server';
import { populateMember } from '@/convex/members/utils/populateMember';
import { populateReactions } from '@/convex/reactions/utils/populateReactions';
import { populateUser } from '@/convex/users/utils/populateUser';

import { populateThread } from '../utils/populateThread';

type Args = {
	channelId?: Id<'channels'>;
	conversationId?: Id<'conversations'>;
	parentMessageId?: Id<'messages'>;
	workspaceId?: Id<'workspaces'>;
	paginationOpts: PaginationOptions;
};

export const getHandler = async (ctx: QueryCtx, args: Args) => {
	const userId = await getAuthUserId(ctx);

	if (userId === null) {
		throw new ConvexError('Unauthorized');
	}

	let _conversationId = args.conversationId;

	if (!args.conversationId && !args.channelId && args.parentMessageId) {
		const parentMessage = await ctx.db.get(args.parentMessageId);

		if (!parentMessage) {
			throw new ConvexError('Parent message not found');
		}

		_conversationId = parentMessage.conversationId;
	}

	const results = await ctx.db
		.query('messages')
		.withIndex('by_channel_id_parent_message_id_conversation_id', q =>
			q
				.eq('channelId', args.channelId)
				.eq('parentMessageId', args.parentMessageId)
				.eq('conversationId', _conversationId),
		)
		.order('desc')
		.paginate(args.paginationOpts);

	return {
		...results,
		page: (
			await Promise.all(
				results.page.map(async message => {
					const member = await populateMember(ctx, message.memberId);
					const user = member ? await populateUser(ctx, member.userId) : null;

					if (!member || !user) {
						return null;
					}

					const reactions = await populateReactions(ctx, message._id);
					const thread = await populateThread(ctx, message._id);
					const image = message.image
						? await ctx.storage.getUrl(message.image)
						: undefined;

					const reactionsWithCounts = reactions.map(reaction => {
						return {
							...reaction,
							count: reactions.filter(r => r.value === reaction.value).length,
						};
					});

					const dedupedReactions = reactionsWithCounts.reduce(
						(acc, reaction) => {
							const existingReaction = acc.find(
								r => r.value === reaction.value,
							);

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
						image,
						member,
						user,
						reactions: reactionsWithoutMemberIdProperty,
						threadCount: thread.count,
						threadImage: thread.image,
						threadName: thread.name,
						threadTimeStamp: thread.timeStamp,
					};
				}),
			)
		).filter(message => message !== null),
	};
};
