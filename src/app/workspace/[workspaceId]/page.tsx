'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import { PageLoader } from '@/components/common/page-loader';
import { useGetChannels } from '@/features/channels/api/use-get-channels';
import { useCreateChannelModal } from '@/features/channels/hooks/use-create-channel-modal';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';

export default function WorkspacePage() {
	const workspaceId = useWorkspaceId();
	const router = useRouter();
	const [open, setOpen] = useCreateChannelModal();

	const { member, isLoadingMember } = useCurrentMember({
		workspaceId,
	});
	const { workspace, isLoadingWorkspace } = useGetWorkspace({
		workspaceId,
	});
	const { channels, isLoadingChannels } = useGetChannels({
		workspaceId,
	});

	const channelId = useMemo(() => channels?.[0]?._id, [channels]);
	const isAdmin = useMemo(() => member?.role == 'admin', [member?.role]);

	useEffect(() => {
		if (
			isLoadingWorkspace ||
			isLoadingChannels ||
			isLoadingMember ||
			!member ||
			!workspace
		) {
			return;
		}

		if (channelId) {
			router.push(`/workspace/${workspaceId}/channel/${channelId}`);
		} else if (!open && isAdmin) {
			setOpen(true);
		}
	}, [
		isLoadingWorkspace,
		isLoadingChannels,
		isLoadingMember,
		member,
		isAdmin,
		channelId,
		workspace,
		open,
		setOpen,
		router,
		workspaceId,
	]);

	return <PageLoader />;
}
