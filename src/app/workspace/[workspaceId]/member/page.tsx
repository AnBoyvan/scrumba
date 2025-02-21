'use client';

import { useMemo, useState } from 'react';

import { SearchIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { PageLoader } from '@/components/common/page-loader';
import { Input } from '@/components/ui/input';
import { useGetConversations } from '@/features/conversations/api/use-get-conversations';
import { ConversationItem } from '@/features/conversations/components/conversation-item';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';

export default function DirectMessagesPage() {
	const t = useTranslations();
	const workspaceId = useWorkspaceId();

	const [search, setSearch] = useState('');

	const { conversations, isLoadingConversations } = useGetConversations({
		workspaceId,
	});

	const filtered = useMemo(
		() =>
			conversations?.filter(conv => conv.member.user.name?.includes(search)),
		[conversations, search],
	);

	if (isLoadingConversations) {
		return <PageLoader />;
	}

	return (
		<div className="flex flex-col h-full w-full py-4">
			<h1 className="text-xl font-bold px-4">{t('common.dir_msgs')}</h1>
			<div className="relative max-w-72 m-4">
				<div className="absolute flex items-center justify-center size-8  top-1/2 -translate-y-1/2 left-0">
					<SearchIcon className="size-4 text-muted-foreground" />
				</div>
				<Input
					type="search"
					placeholder={t('common.search')}
					value={search}
					onChange={e => setSearch(e.target.value)}
					className="pl-8 h-9 text-sm bg-accent"
				/>
			</div>
			{filtered?.map(conversation => (
				<ConversationItem key={conversation._id} conversation={conversation} />
			))}
		</div>
	);
}
