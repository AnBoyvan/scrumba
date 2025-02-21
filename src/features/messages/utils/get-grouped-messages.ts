import { format } from 'date-fns';

import { GetMessagesReturnType } from '../api/use-get-messages';

export const getGroupedMessages = (data: GetMessagesReturnType | undefined) => {
	return data?.reduce(
		(groups, message) => {
			const date = new Date(message._creationTime);
			const dateKey = format(date, 'yyyy-MM-dd');
			if (!groups[dateKey]) {
				groups[dateKey] = [];
			}
			groups[dateKey].unshift(message);
			return groups;
		},
		{} as Record<string, typeof data>,
	);
};
