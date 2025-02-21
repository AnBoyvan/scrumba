'use client';

import { useTranslations } from 'next-intl';

import { NotFound } from '@/components/common/not-found';
import { PageLoader } from '@/components/common/page-loader';
import { useGetChannel } from '@/features/channels/api/use-get-channel';
import { ChannelChatInput } from '@/features/channels/components/channel-chat-input';
import { ChannelHeader } from '@/features/channels/components/channel-header';
import { useChannelId } from '@/features/channels/hooks/use-channel-id';
import { useGetMessages } from '@/features/messages/api/use-get-messages';
import { MessageList } from '@/features/messages/components/message-list';

export default function ChannelIdPage() {
	const t = useTranslations();
	const channelId = useChannelId();

	const { results, status, loadMore } = useGetMessages({ channelId });
	const { channel, isLoadingChannel } = useGetChannel({
		channelId,
	});

	if (isLoadingChannel || status === 'LoadingFirstPage') {
		return <PageLoader />;
	}

	if (!channel) {
		return <NotFound message={t('channel.not_found')} />;
	}

	return (
		<div className="flex flex-col h-full">
			<ChannelHeader title={channel.name} />
			<MessageList
				channelName={channel.name}
				channelCreationTime={channel._creationTime}
				data={results}
				loadMore={loadMore}
				isLoadingMore={status === 'LoadingMore'}
				canLoadMore={status === 'CanLoadMore'}
				variant="channel"
			/>
			<ChannelChatInput
				placeholder={`${t('common.message')}# ${channel.name}`}
			/>
		</div>
	);
}
