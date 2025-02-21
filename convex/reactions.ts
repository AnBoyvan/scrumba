import { v } from 'convex/values';

import { mutation } from './_generated/server';
import { toggleHandler } from './reactions/handlers/toggle';

export const toggle = mutation({
	args: { messageId: v.id('messages'), value: v.string() },
	handler: toggleHandler,
});
