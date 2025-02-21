import { getAuthUserId } from '@convex-dev/auth/server';
import { ConvexError } from 'convex/values';

import { Id } from '@/convex/_generated/dataModel';
import { MutationCtx } from '@/convex/_generated/server';
import { getMember } from '@/convex/members/utils/getMember';

type Args = {
	workspaceId: Id<'workspaces'>;
};

export const removeHandler = async (ctx: MutationCtx, args: Args) => {
	const userId = await getAuthUserId(ctx);

	if (!userId) {
		throw new ConvexError('Unauthorized');
	}

	const member = await getMember(ctx, args.workspaceId, userId);

	if (!member || member.role !== 'admin') {
		throw new ConvexError('Access denied');
	}

	const [members, channels, conversations, messages, reactions] =
		await Promise.all([
			ctx.db
				.query('members')
				.withIndex('by_workspace_id', q =>
					q.eq('workspaceId', args.workspaceId),
				)
				.collect(),
			ctx.db
				.query('channels')
				.withIndex('by_workspace_id', q =>
					q.eq('workspaceId', args.workspaceId),
				)
				.collect(),
			ctx.db
				.query('conversations')
				.withIndex('by_workspace_id', q =>
					q.eq('workspaceId', args.workspaceId),
				)
				.collect(),
			ctx.db
				.query('messages')
				.withIndex('by_workspace_id', q =>
					q.eq('workspaceId', args.workspaceId),
				)
				.collect(),
			ctx.db
				.query('reactions')
				.withIndex('by_workspace_id', q =>
					q.eq('workspaceId', args.workspaceId),
				)
				.collect(),
		]);

	const images = messages
		.map(msg => msg.image)
		.filter(item => item !== undefined);

	for (const member of members) {
		await ctx.db.delete(member._id);
	}

	for (const channel of channels) {
		await ctx.db.delete(channel._id);
	}

	for (const conversation of conversations) {
		await ctx.db.delete(conversation._id);
	}

	for (const message of messages) {
		await ctx.db.delete(message._id);
	}

	for (const reaction of reactions) {
		await ctx.db.delete(reaction._id);
	}

	for (const image of images) {
		await ctx.storage.delete(image);
	}

	await ctx.db.delete(args.workspaceId);

	return args.workspaceId;
};
