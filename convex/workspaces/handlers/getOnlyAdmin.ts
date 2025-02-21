import { getAuthUserId } from '@convex-dev/auth/server';

import { QueryCtx } from '../../_generated/server';

export const getOnlyAdminHandler = async (ctx: QueryCtx) => {
	const userId = await getAuthUserId(ctx);

	if (!userId) {
		return [];
	}

	const admins = await ctx.db
		.query('members')
		.withIndex('by_user_id', q => q.eq('userId', userId))
		.filter(q => q.eq(q.field('role'), 'admin'))
		.collect();

	const workspaceIds = admins.map(member => member.workspaceId);

	const workspaces = await Promise.all(
		workspaceIds.map(async workspaceId => {
			const workspace = await ctx.db.get(workspaceId);

			if (workspace) {
				const members = await ctx.db
					.query('members')
					.withIndex('by_workspace_id', q => q.eq('workspaceId', workspace._id))
					.collect();

				const admins = members.filter(member => member.role === 'admin');

				if (admins.length > 1) {
					return null;
				}

				const withoutUser = members.filter(member => member.userId !== userId);

				const populatedMembers = await Promise.all(
					withoutUser.map(async member => {
						const user = await ctx.db.get(member.userId);
						if (!user) {
							return null;
						}

						return {
							...member,
							name: user.name,
							email: user.email,
							image: user.image,
						};
					}),
				);

				const filteredMembers = populatedMembers.filter(
					member => member !== null,
				);

				return { ...workspace, members: filteredMembers };
			}
		}),
	);

	const filteredWorkspaces = workspaces.filter(workspace => !!workspace);

	return filteredWorkspaces;
};
