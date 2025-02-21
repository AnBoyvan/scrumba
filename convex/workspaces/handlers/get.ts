import { getAuthUserId } from '@convex-dev/auth/server';

import { Doc } from '@/convex/_generated/dataModel';
import { QueryCtx } from '@/convex/_generated/server';

export const getHandler = async (ctx: QueryCtx) => {
	const userId = await getAuthUserId(ctx);

	if (!userId) {
		return [];
	}

	const members = await ctx.db
		.query('members')
		.withIndex('by_user_id', q => q.eq('userId', userId))
		.collect();

	const workspaceIds = members.map(member => member.workspaceId);

	const workspaces: Doc<'workspaces'>[] = [];

	for (const workspaceId of workspaceIds) {
		const workspace = await ctx.db.get(workspaceId);

		if (workspace) {
			workspaces.push(workspace);
		}
	}

	return workspaces;
};
