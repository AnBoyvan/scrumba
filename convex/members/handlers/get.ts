import { getAuthUserId } from '@convex-dev/auth/server';

import { Id } from '@/convex/_generated/dataModel';
import { QueryCtx } from '@/convex/_generated/server';
import { populateUser } from '@/convex/users/utils/populateUser';

import { getMember } from '../utils/getMember';

type Args = {
	workspaceId: Id<'workspaces'>;
};

export const getHandler = async (ctx: QueryCtx, args: Args) => {
	const userId = await getAuthUserId(ctx);

	if (userId === null) {
		return [];
	}

	const member = await getMember(ctx, args.workspaceId, userId);

	if (!member) {
		return [];
	}

	const data = await ctx.db
		.query('members')
		.withIndex('by_workspace_id', q => q.eq('workspaceId', args.workspaceId))
		.collect();

	const members = [];

	for (const member of data) {
		const user = await populateUser(ctx, member.userId);

		if (user) {
			members.push({
				...member,
				user,
			});
		}
	}

	return members;
};
