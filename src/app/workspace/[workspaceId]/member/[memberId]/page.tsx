'use client';

import { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import { NotFound } from '@/components/common/not-found';
import { PageLoader } from '@/components/common/page-loader';
import { Id } from '@/convex/_generated/dataModel';
import { useCreateOrGetConversation } from '@/features/conversations/api/use-create-or-get-conversation';
import { Conversation } from '@/features/conversations/components/conversation';
import { useMemberId } from '@/features/members/hooks/use-member-id';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';

export default function MemberIdPage() {
	const t = useTranslations();
	const workspaceId = useWorkspaceId();
	const memberId = useMemberId();

	const [conversationId, setConversationId] =
		useState<Id<'conversations'> | null>(null);

	const { mutate, status, isPending } = useCreateOrGetConversation();

	useEffect(() => {
		mutate(
			{
				workspaceId,
				memberId,
			},
			{
				onSuccess(data) {
					setConversationId(data);
				},
			},
		);
	}, [workspaceId, memberId, mutate]);

	if (status === null || isPending) {
		return <PageLoader />;
	}

	if (!conversationId) {
		return <NotFound message={t('conversation.not_found')} />;
	}

	return <Conversation id={conversationId} />;
}
