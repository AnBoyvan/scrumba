'use client';

import { HashIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { NotFound } from '@/components/common/not-found';
import { Spinner } from '@/components/common/spinner';
import { SidebarItem } from '@/components/layout/sidebar-item';
import { SidebarSection } from '@/components/layout/sidebar-section';
import { useGetChannels } from '@/features/channels/api/use-get-channels';
import { useChannelId } from '@/features/channels/hooks/use-channel-id';
import { useCreateChannelModal } from '@/features/channels/hooks/use-create-channel-modal';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { MemberItem } from '@/features/members/components/member-item';
import { useMemberId } from '@/features/members/hooks/use-member-id';

import { useGetWorkspace } from '../api/use-get-workspace';
import { useWorkspaceId } from '../hooks/use-workspace-id';
import { WorkspaceHeader } from './workspace-header';

export const WorkspaceSidebar = () => {
	const t = useTranslations();
	const workspaceId = useWorkspaceId();
	const channelId = useChannelId();
	const memberId = useMemberId();
	const [_open, setOpen] = useCreateChannelModal();

	const { member, isLoadingMember } = useCurrentMember({
		workspaceId,
	});
	const { workspace, isLoadingWorkspace } = useGetWorkspace({
		workspaceId,
	});
	const { channels, isLoadingChannels } = useGetChannels({
		workspaceId,
	});
	const { members, isLoadingMembers } = useGetMembers({
		workspaceId,
	});

	if (
		isLoadingMember ||
		isLoadingWorkspace ||
		isLoadingChannels ||
		isLoadingMembers
	) {
		return (
			<div className="w-full h-full flex items-center justify-center">
				<Spinner />
			</div>
		);
	}

	if (!member || !workspace) {
		return <NotFound message={t('workspace.not_found')} />;
	}

	return (
		<div className="flex flex-col h-full">
			<WorkspaceHeader
				workspace={workspace}
				isAdmin={member.role === 'admin'}
			/>
			<SidebarSection
				label={t('common.channels')}
				hint={t('channel.new')}
				onNew={member.role === 'admin' ? () => setOpen(true) : undefined}
			>
				{channels?.map(item => (
					<SidebarItem
						key={item._id}
						label={item.name}
						id={item._id}
						icon={HashIcon}
						variant={channelId === item._id ? 'active' : 'default'}
					/>
				))}
			</SidebarSection>
			<SidebarSection label={t('common.dir_msgs')}>
				<div></div>
				{members?.map(item => (
					<MemberItem
						key={item._id}
						id={item._id}
						label={item.user.name}
						image={item.user.image}
						variant={item._id === memberId ? 'active' : 'default'}
					/>
				))}
			</SidebarSection>
		</div>
	);
};
