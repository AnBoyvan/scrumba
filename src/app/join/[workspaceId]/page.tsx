'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import { useTranslations } from 'next-intl';
import VerificationInput from 'react-verification-input';
import { toast } from 'sonner';

import { PageLoader } from '@/components/common/page-loader';
import { Button } from '@/components/ui/button';
import { useGetWorkspaceInfo } from '@/features/workspaces/api/use-get-workspace-info';
import { useJoin } from '@/features/workspaces/api/use-join';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { cn } from '@/lib/utils';

export default function JoinPage() {
	const t = useTranslations();
	const router = useRouter();
	const workspaceId = useWorkspaceId();

	const { info, isLoadingInfo } = useGetWorkspaceInfo({ workspaceId });

	const { mutate, isPending } = useJoin();

	const isMember = useMemo(() => info?.isMember, [info?.isMember]);

	useEffect(() => {
		if (isMember) {
			router.replace(`/workspace/${workspaceId}`);
		}
	}, [isMember, router, workspaceId]);

	const handleComplete = (value: string) => {
		mutate(
			{ workspaceId, joinCode: value },
			{
				onSuccess: id => {
					router.replace(`/workspace/${id}`);
					toast.success(t('workspace.join_success'));
				},
			},
		);
	};

	if (isLoadingInfo) {
		return <PageLoader />;
	}

	return (
		<div className="h-full flex flex-col gap-y-8 items-center justify-center p-8 bg-card rounded-lg shadow-md">
			<Image src="/logo.svg" width={60} height={60} alt="Logo" />
			<div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
				<div className="flex flex-col gap-y-2 items-center justify-center">
					<h1 className="text-2xl font-bold">
						{t('workspace.join')}
						{info?.name}
					</h1>
					<p className="text-md text-muted-foreground">
						{t('workspace.enter_code')}
					</p>
				</div>
				<VerificationInput
					length={6}
					onComplete={handleComplete}
					classNames={{
						container: cn(
							'flex gap-x-2',
							isPending && 'opacity-50 cursor-not-allowed',
						),
						character:
							'uppercase h-auto rounded-md border flex items-center justify-center text-lg font-medium text-gray-500',
						characterInactive: 'bg-slate-400',
						characterSelected: 'bg-white text-black',
						characterFilled: 'bg-white text-black',
					}}
					autoFocus
				/>
			</div>
			<div className="flex gap-x-4">
				<Button size="lg" variant="outline" asChild>
					<Link href="/">{t('actions.back_home')}</Link>
				</Button>
			</div>
		</div>
	);
}
