import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

interface UseGetMessageProps {
	messageId: Id<'messages'>;
}

export const useGetMessage = ({ messageId }: UseGetMessageProps) => {
	const message = useQuery(api.messages.getById, { messageId });

	const isLoadingMessage = message === undefined;

	return { message, isLoadingMessage };
};
