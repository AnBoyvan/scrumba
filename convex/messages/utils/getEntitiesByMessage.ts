import { Id } from '../../_generated/dataModel';
import { QueryCtx } from '../../_generated/server';

export const getEntitiesByMessage = async (
	ctx: QueryCtx,
	messageId: Id<'messages'>,
) => {
	const reactions = await ctx.db
		.query('reactions')
		.withIndex('by_message_id', q => q.eq('messageId', messageId))
		.collect();

	return { reactions };
};
