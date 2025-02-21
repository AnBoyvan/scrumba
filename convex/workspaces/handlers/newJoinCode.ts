import { getAuthUserId } from '@convex-dev/auth/server';
import { ConvexError } from 'convex/values';

import { Id } from '@/convex/_generated/dataModel';
import { MutationCtx } from '@/convex/_generated/server';
import { getMember } from '@/convex/members/utils/getMember';

import { generateCode } from '../utils/generateCode';

type Args = {
	workspaceId: Id<'workspaces'>;
};

export const newJoinCodeHandler = async (ctx: MutationCtx, args: Args) => {
	const userId = await getAuthUserId(ctx);

	if (!userId) {
		throw new ConvexError('Unauthorized');
	}

	const member = await getMember(ctx, args.workspaceId, userId);

	if (!member || member.role !== 'admin') {
		throw new ConvexError('Access denied');
	}

	const joinCode = generateCode();

	await ctx.db.patch(args.workspaceId, { joinCode });

	return args.workspaceId;
};
