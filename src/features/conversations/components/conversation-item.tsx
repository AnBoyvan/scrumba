import Link from 'next/link';

import { useTranslations } from 'next-intl';

import { UserAvatar } from '@/components/common/user-avatar';

import { DirectConversation } from '../types';

interface ConversationItemProps {
	conversation: DirectConversation;
}

export const ConversationItem = ({ conversation }: ConversationItemProps) => {
	const t = useTranslations();
	return (
		<Link
			href={`/workspace/${conversation.workspaceId}/member/${conversation.member._id}`}
			className="flex gap-x-3 w-full px-4 py-2 border-b hover:bg-accent/30"
		>
			<UserAvatar name={conversation.member.user.name} />
			<div className="flex flex-col overflow-hidden">
				<p className="font-semibold truncate">
					{conversation.member.user.name}
				</p>
				<p className="text-xs text-muted-foreground truncate">
					{t(`common.${conversation.member.role}`)}
				</p>
			</div>
		</Link>
	);
};
