import { getAuthUserId } from '@convex-dev/auth/server';
import { ConvexError } from 'convex/values';

import { Id } from '@/convex/_generated/dataModel';
import { MutationCtx } from '@/convex/_generated/server';
import { getMember } from '@/convex/members/utils/getMember';

type Args = {
	workspaceId: Id<'workspaces'>;
	joinCode: string;
};

export const joinHandler = async (ctx: MutationCtx, args: Args) => {
	const userId = await getAuthUserId(ctx);

	if (!userId) {
		throw new ConvexError('Unauthorized');
	}

	const workspace = await ctx.db.get(args.workspaceId);

	if (!workspace) {
		throw new ConvexError('Workspace not found');
	}

	if (workspace.joinCode !== args.joinCode.toLowerCase()) {
		throw new ConvexError('Failed to join workspace');
	}

	const existingMember = await getMember(ctx, args.workspaceId, userId);

	if (existingMember) {
		throw new ConvexError('Already a member of this workspace');
	}

	await ctx.db.insert('members', {
		userId,
		workspaceId: workspace._id,
		role: 'member',
	});

	return workspace._id;
};
