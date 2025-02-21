import { Doc } from '@/convex/_generated/dataModel';

export type DirectConversation = Doc<'conversations'> & {
	member: Doc<'members'> & {
		user: Doc<'users'>;
	};
};
