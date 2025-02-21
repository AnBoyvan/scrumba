import { useState } from 'react';

import { differenceInMinutes } from 'date-fns';

import { Observer } from '@/components/common/observer';
import { Spinner } from '@/components/common/spinner';
import { Id } from '@/convex/_generated/dataModel';
import { ChannelHero } from '@/features/channels/components/channel-hero';
import { ConversationHero } from '@/features/conversations/components/conversation-hero';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useDateFormatter } from '@/hooks/use-date-formatter';

import { GetMessagesReturnType } from '../api/use-get-messages';
import { MESSAGES_TIME_THRESHOLD } from '../constants';
import { getGroupedMessages } from '../utils/get-grouped-messages';
import { Message } from './message';
import { MessagesSeparator } from './messages-separtor';

interface MessageListProps {
	memberName?: string;
	memberImage?: string;
	channelName?: string;
	channelCreationTime?: number;
	variant?: 'channel' | 'thread' | 'conversation';
	data: GetMessagesReturnType | undefined;
	loadMore: () => void;
	isLoadingMore?: boolean;
	canLoadMore?: boolean;
}

export const MessageList = ({
	memberName,
	memberImage,
	channelName,
	channelCreationTime,
	variant,
	data,
	loadMore,
	isLoadingMore,
	canLoadMore,
}: MessageListProps) => {
	const workspaceId = useWorkspaceId();
	const { formatDateLabel } = useDateFormatter();

	const [editingId, setEditingId] = useState<Id<'messages'> | null>(null);

	const { member } = useCurrentMember({ workspaceId });

	const groupedMessages = getGroupedMessages(data);

	return (
		<div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
			{Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
				<div key={dateKey}>
					<MessagesSeparator content={formatDateLabel(dateKey)} />
					{messages.map((message, idx) => {
						const prevMessage = messages[idx - 1];
						const isCompact =
							prevMessage &&
							prevMessage.user?._id &&
							differenceInMinutes(
								new Date(message._creationTime),
								new Date(prevMessage._creationTime),
							) < MESSAGES_TIME_THRESHOLD;

						return (
							<Message
								key={message._id}
								messageId={message._id}
								memberId={message.memberId}
								authorImage={message.user.image}
								authorName={message.user.name}
								isAuthor={message.memberId === member?._id}
								reactions={message.reactions}
								body={message.body}
								image={message.image}
								updatedAt={message.updatedAt}
								createdAt={message._creationTime}
								isEditing={editingId === message._id}
								setEditingId={setEditingId}
								isCompact={isCompact}
								hideThreadButton={variant === 'thread'}
								threadCount={message.threadCount}
								threadImage={message.threadImage}
								threadName={message.threadName}
								treadTimeStamp={message.threadTimeStamp}
							/>
						);
					})}
				</div>
			))}
			<Observer condition={canLoadMore} onIntersect={loadMore} />
			{isLoadingMore && <MessagesSeparator content={<Spinner size={4} />} />}
			{variant === 'channel' && channelName && channelCreationTime && (
				<ChannelHero name={channelName} creationTime={channelCreationTime} />
			)}
			{variant === 'conversation' && (
				<ConversationHero name={memberName} image={memberImage} />
			)}
		</div>
	);
};
