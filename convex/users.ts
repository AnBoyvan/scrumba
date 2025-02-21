import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { currentHandler } from './users/handlers/current';
import { removeHandler } from './users/handlers/remove';
import { updateHandler } from './users/handlers/update';

export const current = query({
	args: {},
	handler: currentHandler,
});

export const update = mutation({
	args: {
		name: v.string(),
	},
	handler: updateHandler,
});

export const remove = mutation({
	args: {},
	handler: removeHandler,
});
