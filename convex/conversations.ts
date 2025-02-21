import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { createOrGetHandler } from './conversations/handlers/createOrGet';
import { getAllHandler } from './conversations/handlers/getAll';

export const createOrGet = mutation({
	args: {
		workspaceId: v.id('workspaces'),
		memberId: v.id('members'),
	},
	handler: createOrGetHandler,
});

export const getAll = query({
	args: {
		workspaceId: v.id('workspaces'),
	},
	handler: getAllHandler,
});
