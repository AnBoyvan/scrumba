import { getAuthUserId } from '@convex-dev/auth/server';

import { Id } from '@/convex/_generated/dataModel';
import { QueryCtx } from '@/convex/_generated/server';
import { getMember } from '@/convex/members/utils/getMember';

type Args = {
	channelId: Id<'channels'>;
};

export const getByIdHandler = async (ctx: QueryCtx, args: Args) => {
	const userId = await getAuthUserId(ctx);

	if (!userId) {
		return null;
	}

	const channel = await ctx.db.get(args.channelId);

	if (!channel) {
		return null;
	}

	const member = await getMember(ctx, channel.workspaceId, userId);

	if (!member) {
		return null;
	}

	return channel;
};
