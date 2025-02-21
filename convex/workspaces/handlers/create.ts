import { getAuthUserId } from '@convex-dev/auth/server';
import { ConvexError } from 'convex/values';

import { MutationCtx } from '@/convex/_generated/server';

import { generateCode } from '../utils/generateCode';

type Args = {
	name: string;
	channelName: string;
};

export const createHandler = async (ctx: MutationCtx, args: Args) => {
	const userId = await getAuthUserId(ctx);

	if (!userId) {
		throw new ConvexError('Unauthorized');
	}

	const joinCode = generateCode();

	const workspaceId = await ctx.db.insert('workspaces', {
		name: args.name,
		userId,
		joinCode,
	});

	await ctx.db.insert('members', {
		userId,
		workspaceId,
		role: 'admin',
	});

	await ctx.db.insert('channels', {
		name: args.channelName,
		workspaceId,
	});

	return workspaceId;
};
