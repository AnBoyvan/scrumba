'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import { PageLoader } from '@/components/common/page-loader';
import { useGetWorkspaces } from '@/features/workspaces/api/use-get-workspaces';
import { useCreateWorkspaceModal } from '@/features/workspaces/hooks/use-create-workspace-modal';

export default function HomePage() {
	const router = useRouter();
	const [open, setOpen] = useCreateWorkspaceModal();
	const { workspaces, isLoadingWorkspaces } = useGetWorkspaces();

	const workspaceId = useMemo(() => workspaces?.[0]?._id, [workspaces]);

	useEffect(() => {
		if (isLoadingWorkspaces) return;

		if (workspaceId) {
			router.replace(`/workspace/${workspaceId}`);
		} else {
			setOpen(true);
		}
	}, [workspaceId, isLoadingWorkspaces, open, setOpen, router]);

	return <PageLoader />;
}
