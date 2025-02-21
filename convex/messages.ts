import { paginationOptsValidator } from 'convex/server';
import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { createHandler } from './messages/handlers/create';
import { getHandler } from './messages/handlers/get';
import { getByIdHandler } from './messages/handlers/getById';
import { removeHandler } from './messages/handlers/remove';
import { updateHandler } from './messages/handlers/update';

export const create = mutation({
	args: {
		body: v.string(),
		image: v.optional(v.id('_storage')),
		workspaceId: v.id('workspaces'),
		channelId: v.optional(v.id('channels')),
		conversationId: v.optional(v.id('conversations')),
		parentMessageId: v.optional(v.id('messages')),
	},
	handler: createHandler,
});

export const get = query({
	args: {
		channelId: v.optional(v.id('channels')),
		conversationId: v.optional(v.id('conversations')),
		parentMessageId: v.optional(v.id('messages')),
		workspaceId: v.optional(v.id('workspaces')),
		paginationOpts: paginationOptsValidator,
	},
	handler: getHandler,
});

export const getById = query({
	args: {
		messageId: v.id('messages'),
	},
	handler: getByIdHandler,
});

export const update = mutation({
	args: {
		messageId: v.id('messages'),
		body: v.string(),
	},
	handler: updateHandler,
});

export const remove = mutation({
	args: {
		messageId: v.id('messages'),
	},
	handler: removeHandler,
});
