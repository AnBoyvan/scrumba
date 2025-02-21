import { getAuthUserId } from '@convex-dev/auth/server';

import { Id } from '@/convex/_generated/dataModel';
import { QueryCtx } from '@/convex/_generated/server';

import { getMember } from '../utils/getMember';

type Args = {
	workspaceId: Id<'workspaces'>;
};

export const currentHandler = async (ctx: QueryCtx, args: Args) => {
	const userId = await getAuthUserId(ctx);

	if (userId === null) {
		return null;
	}

	const member = await getMember(ctx, args.workspaceId, userId);

	if (!member) {
		return null;
	}

	return member;
};
