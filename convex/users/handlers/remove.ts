import { getAuthUserId } from '@convex-dev/auth/server';
import { ConvexError } from 'convex/values';

import { onMemberRemove } from '@/convex/members/utils/onMemberRemove';

import { MutationCtx } from '../../_generated/server';

export const removeHandler = async (ctx: MutationCtx) => {
	const userId = await getAuthUserId(ctx);

	if (!userId) {
		throw new ConvexError('Unauthorized');
	}

	const members = await ctx.db
		.query('members')
		.withIndex('by_user_id', q => q.eq('userId', userId))
		.collect();

	const admins = members.filter(member => member.role === 'admin');

	for (const admin of admins) {
		const workspaceAdmins = await ctx.db
			.query('members')
			.withIndex('by_workspace_id', q => q.eq('workspaceId', admin.workspaceId))
			.filter(q => q.eq(q.field('role'), 'admin'))
			.collect();

		if (workspaceAdmins.length < 2) {
			throw new ConvexError(
				'You cannot delete your account while being the only admin of workspace. Please designate a new admin first.',
			);
		}
	}

	for (const member of members) {
		await onMemberRemove(ctx, member._id, member.workspaceId);
		await ctx.db.delete(member._id);
	}

	const authAccounts = await ctx.db
		.query('authAccounts')
		.withIndex('userIdAndProvider', q => q.eq('userId', userId))
		.collect();

	for (const account of authAccounts) {
		await ctx.db.delete(account._id);
	}

	const authSessions = await ctx.db
		.query('authSessions')
		.withIndex('userId', q => q.eq('userId', userId))
		.collect();

	for (const session of authSessions) {
		await ctx.db.delete(session._id);
	}

	await ctx.db.delete(userId);

	return userId;
};
