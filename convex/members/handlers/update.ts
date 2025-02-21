import { getAuthUserId } from '@convex-dev/auth/server';
import { ConvexError } from 'convex/values';

import { Doc, Id } from '@/convex/_generated/dataModel';
import { MutationCtx } from '@/convex/_generated/server';

import { getMember } from '../utils/getMember';

type Args = {
	memberId: Id<'members'>;
	role: Doc<'members'>['role'];
};

export const updateHandler = async (ctx: MutationCtx, args: Args) => {
	const userId = await getAuthUserId(ctx);

	if (userId === null) {
		throw new ConvexError('Unauthorized');
	}

	const member = await ctx.db.get(args.memberId);

	if (!member) {
		throw new ConvexError('Member not found');
	}

	const currentMember = await getMember(ctx, member.workspaceId, userId);

	if (!currentMember || currentMember.role !== 'admin') {
		throw new ConvexError('Access denied');
	}

	await ctx.db.patch(args.memberId, {
		role: args.role,
	});

	return member._id;
};
