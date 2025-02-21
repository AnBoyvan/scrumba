import { useTranslations } from 'next-intl';

import { Spinner } from '@/components/common/spinner';
import { Id } from '@/convex/_generated/dataModel';
import { useGetMember } from '@/features/members/api/use-get-member';
import { useMemberId } from '@/features/members/hooks/use-member-id';
import { useGetMessages } from '@/features/messages/api/use-get-messages';
import { MessageList } from '@/features/messages/components/message-list';
import { usePanel } from '@/hooks/use-panel';

import { ConversationChatInput } from './conversation-chat-input';
import { ConversationHeader } from './conversation-header';

interface ConversationProps {
	id: Id<'conversations'>;
}

export const Conversation = ({ id }: ConversationProps) => {
	const t = useTranslations();
	const memberId = useMemberId();

	const { onOpenProfile } = usePanel();

	const { member, isLoadingMember } = useGetMember({ memberId });
	const { results, status, loadMore } = useGetMessages({ conversationId: id });

	if (isLoadingMember) {
		return (
			<div className="h-full w-full flex items-center justify-center">
				<Spinner />
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full w-full">
			<ConversationHeader
				memberName={member?.user.name}
				memberImage={member?.user.image}
				onClick={() => onOpenProfile(memberId)}
			/>
			<MessageList
				data={results}
				variant="conversation"
				memberImage={member?.user.image}
				memberName={member?.user.name}
				loadMore={loadMore}
				isLoadingMore={status === 'LoadingMore'}
				canLoadMore={status === 'CanLoadMore'}
			/>
			<ConversationChatInput
				placeholder={`${t('common.message')}${member?.user.name}`}
				conversationId={id}
			/>
		</div>
	);
};
