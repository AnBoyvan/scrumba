import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { createHandler } from './workspaces/handlers/create';
import { getHandler } from './workspaces/handlers/get';
import { getByIdHandler } from './workspaces/handlers/getById';
import { getInfoByIdHandler } from './workspaces/handlers/getInfoById';
import { getOnlyAdminHandler } from './workspaces/handlers/getOnlyAdmin';
import { joinHandler } from './workspaces/handlers/join';
import { newJoinCodeHandler } from './workspaces/handlers/newJoinCode';
import { removeHandler } from './workspaces/handlers/remove';
import { updateHandler } from './workspaces/handlers/update';

export const create = mutation({
	args: {
		name: v.string(),
		channelName: v.string(),
	},
	handler: createHandler,
});

export const get = query({
	args: {},
	handler: getHandler,
});

export const getInfoById = query({
	args: {
		workspaceId: v.id('workspaces'),
	},
	handler: getInfoByIdHandler,
});

export const getById = query({
	args: { workspaceId: v.id('workspaces') },
	handler: getByIdHandler,
});

export const getOnlyAdmin = query({
	args: {},
	handler: getOnlyAdminHandler,
});

export const update = mutation({
	args: {
		workspaceId: v.id('workspaces'),
		name: v.string(),
	},
	handler: updateHandler,
});

export const newJoinCode = mutation({
	args: {
		workspaceId: v.id('workspaces'),
	},
	handler: newJoinCodeHandler,
});

export const join = mutation({
	args: {
		joinCode: v.string(),
		workspaceId: v.id('workspaces'),
	},
	handler: joinHandler,
});

export const remove = mutation({
	args: {
		workspaceId: v.id('workspaces'),
	},
	handler: removeHandler,
});
