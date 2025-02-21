import { getAuthUserId } from '@convex-dev/auth/server';
import { ConvexError } from 'convex/values';

import { Id } from '@/convex/_generated/dataModel';
import { MutationCtx } from '@/convex/_generated/server';
import { getMember } from '@/convex/members/utils/getMember';

import { onMessageRemove } from '../utils/onMessageRemove';

type Args = {
	messageId: Id<'messages'>;
};

export const removeHandler = async (ctx: MutationCtx, args: Args) => {
	const userId = await getAuthUserId(ctx);

	if (!userId) {
		throw new ConvexError('Unauthorized');
	}

	const message = await ctx.db.get(args.messageId);

	if (!message) {
		throw new ConvexError('Message not found');
	}

	const member = await getMember(ctx, message.workspaceId, userId);

	if (!member || member._id !== message.memberId) {
		throw new ConvexError('Access denied');
	}

	await onMessageRemove(ctx, message);

	await ctx.db.delete(args.messageId);

	return args.messageId;
};
