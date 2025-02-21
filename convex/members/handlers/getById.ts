import { getAuthUserId } from '@convex-dev/auth/server';

import { Id } from '@/convex/_generated/dataModel';
import { QueryCtx } from '@/convex/_generated/server';
import { populateUser } from '@/convex/users/utils/populateUser';

import { getMember } from '../utils/getMember';

type Args = {
	memberId: Id<'members'>;
};

export const getByIdHandler = async (ctx: QueryCtx, args: Args) => {
	const userId = await getAuthUserId(ctx);

	if (userId === null) {
		return null;
	}

	const member = await ctx.db.get(args.memberId);

	if (!member) {
		return null;
	}

	const currentMember = await getMember(ctx, member.workspaceId, member.userId);

	if (!currentMember) {
		return null;
	}

	const user = await populateUser(ctx, member.userId);

	if (!user) {
		return null;
	}

	return {
		...member,
		user,
	};
};
