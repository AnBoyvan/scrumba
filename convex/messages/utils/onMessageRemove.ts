import { Doc } from '@/convex/_generated/dataModel';
import { MutationCtx } from '@/convex/_generated/server';

import { getEntitiesByMessage } from './getEntitiesByMessage';

export const onMessageRemove = async (
	ctx: MutationCtx,
	message: Doc<'messages'>,
) => {
	const { reactions } = await getEntitiesByMessage(ctx, message._id);

	if (message.image) {
		await ctx.storage.delete(message.image);
	}

	for (const reaction of reactions) {
		await ctx.db.delete(reaction._id);
	}
};
