'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useAuthActions } from '@convex-dev/auth/react';
import { MoveLeftIcon, TriangleAlertIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { NotFound } from '@/components/common/not-found';
import { PageLoader } from '@/components/common/page-loader';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCurrentUser } from '@/features/auth/api/use-current-user';
import { useRemoveUser } from '@/features/auth/api/use-remove-user';
import { UserTitle } from '@/features/auth/components/user-title';
import { useGetOnlyAdminWorkspaces } from '@/features/workspaces/api/use-get-only-admin-workspacests';
import { OnlyAdminWorkspaces } from '@/features/workspaces/components/only-admin-workspaces';
import { useConfirm } from '@/hooks/use-confirm';

export default function DeleteAccountPage() {
	const t = useTranslations();
	const router = useRouter();
	const { signOut } = useAuthActions();
	const { user, isLoadingUser } = useCurrentUser();
	const [ConfirmDialog, confirmRemove] = useConfirm(
		t('user.delete_confirm'),
		t('common.irreversible'),
	);

	const { workspaces, isLoadingWorkspaces } = useGetOnlyAdminWorkspaces();

	const { mutate, isPending } = useRemoveUser();

	const removeAccount = async () => {
		const ok = await confirmRemove();

		if (!ok) return;

		mutate(
			{},
			{
				onSuccess: async () => {
					await signOut();
					router.push('/auth');
				},
			},
		);
	};

	if (isLoadingUser || isLoadingWorkspaces) {
		return <PageLoader />;
	}

	if (!user) {
		return <NotFound message={t('user.profile_not_found')} />;
	}

	const canDeleteAccount = Boolean(workspaces && workspaces.length === 0);

	return (
		<>
			<ConfirmDialog />
			<div className="flex flex-col h-full py-10 px-4 md:px-10 gap-y-10 max-w-4xl mx-auto">
				<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-10">
					<Button size="sm" variant="secondary" asChild>
						<Link href="/profile">
							<MoveLeftIcon />
							{t('common.profile')}
						</Link>
					</Button>
					<UserTitle user={user} />
				</div>
				<Separator />
				<div className="w-full flex flex-col gap-4 items-center">
					<div className="flex flex-row items-center gap-4 text-destructive border-2 border-destructive rounded-md p-4">
						<TriangleAlertIcon className="size-8 shrink-0" />
						<p>{t('user.delete_warn')}</p>
					</div>
					{!canDeleteAccount && (
						<p className="text-muted-foreground text-justify">
							{t('user.only_admin')}
						</p>
					)}
					{workspaces && workspaces.length > 0 && (
						<OnlyAdminWorkspaces workspaces={workspaces} />
					)}
					{canDeleteAccount && (
						<>
							<p className="mt-10">{t('user.delete_allow')}</p>
							<Button
								variant="destructive"
								disabled={isPending}
								onClick={removeAccount}
							>
								{t('user.delete')}
							</Button>
						</>
					)}
				</div>
			</div>
		</>
	);
}
