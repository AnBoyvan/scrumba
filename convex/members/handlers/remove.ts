import { getAuthUserId } from '@convex-dev/auth/server';
import { ConvexError } from 'convex/values';

import { Id } from '@/convex/_generated/dataModel';
import { MutationCtx } from '@/convex/_generated/server';

import { getMember } from '../utils/getMember';
import { onMemberRemove } from '../utils/onMemberRemove';

type Args = {
	memberId: Id<'members'>;
};

export const removeHandler = async (ctx: MutationCtx, args: Args) => {
	const userId = await getAuthUserId(ctx);

	if (userId === null) {
		throw new ConvexError('Unauthorized');
	}

	const member = await ctx.db.get(args.memberId);

	if (!member) {
		throw new ConvexError('Workspace not found');
	}

	const currentMember = await getMember(ctx, member.workspaceId, userId);

	if (!currentMember) {
		throw new ConvexError('Access denied');
	}

	if (member.role === 'admin') {
		throw new ConvexError('Admin cannot be removed');
	}

	if (currentMember._id === args.memberId && currentMember.role !== 'admin') {
		throw new ConvexError('You cannot remove yourself if you are an admin');
	}

	if (currentMember.role !== 'admin') {
		throw new ConvexError('Access denied');
	}

	await onMemberRemove(ctx, member._id, member.workspaceId);

	await ctx.db.delete(args.memberId);

	return member._id;
};
