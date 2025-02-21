import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { currentHandler } from './members/handlers/current';
import { getHandler } from './members/handlers/get';
import { getByIdHandler } from './members/handlers/getById';
import { removeHandler } from './members/handlers/remove';
import { updateHandler } from './members/handlers/update';

export const get = query({
	args: {
		workspaceId: v.id('workspaces'),
	},
	handler: getHandler,
});

export const getById = query({
	args: {
		memberId: v.id('members'),
	},
	handler: getByIdHandler,
});

export const current = query({
	args: { workspaceId: v.id('workspaces') },
	handler: currentHandler,
});

export const update = mutation({
	args: {
		memberId: v.id('members'),
		role: v.union(v.literal('admin'), v.literal('member')),
	},
	handler: updateHandler,
});

export const remove = mutation({
	args: {
		memberId: v.id('members'),
	},
	handler: removeHandler,
});
