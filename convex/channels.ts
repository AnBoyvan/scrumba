import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { createHandler } from './channels/handlers/create';
import { getHandler } from './channels/handlers/get';
import { getByIdHandler } from './channels/handlers/getById';
import { removeHandler } from './channels/handlers/remove';
import { updateHandler } from './channels/handlers/update';

export const create = mutation({
	args: {
		name: v.string(),
		workspaceId: v.id('workspaces'),
	},
	handler: createHandler,
});

export const get = query({
	args: {
		workspaceId: v.id('workspaces'),
	},
	handler: getHandler,
});

export const getById = query({
	args: {
		channelId: v.id('channels'),
	},
	handler: getByIdHandler,
});

export const update = mutation({
	args: {
		channelId: v.id('channels'),
		name: v.string(),
	},
	handler: updateHandler,
});

export const remove = mutation({
	args: {
		channelId: v.id('channels'),
	},
	handler: removeHandler,
});
