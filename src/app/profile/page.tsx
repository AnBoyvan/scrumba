'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { MoveLeftIcon, PencilLineIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { NotFound } from '@/components/common/not-found';
import { PageLoader } from '@/components/common/page-loader';
import { RenameModal } from '@/components/common/rename-modal';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCurrentUser } from '@/features/auth/api/use-current-user';
import { useUpdateUser } from '@/features/auth/api/use-update-user';
import { UserTitle } from '@/features/auth/components/user-title';

export default function ProfilePage() {
	const t = useTranslations();
	const { user, isLoadingUser } = useCurrentUser();

	const [value, setValue] = useState(user?.name ?? '');
	const [editOpen, setEditOpen] = useState(false);

	const { mutate, isPending } = useUpdateUser();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!value || user?.name === value) {
			setEditOpen(false);
			return;
		}

		mutate(
			{ name: value },
			{
				onSuccess: () => {
					setEditOpen(false);
					toast.success(t('user.info_updated'));
				},
			},
		);
	};

	useEffect(() => {
		if (user?.name) {
			setValue(user.name);
		}
	}, [user?.name]);

	if (isLoadingUser) {
		return <PageLoader />;
	}

	if (!user) {
		return <NotFound message={t('user.profile_not_found')} />;
	}

	return (
		<div className="flex flex-col h-full py-10 px-4 md:px-10 gap-y-10 max-w-4xl mx-auto">
			<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-10">
				<Button size="sm" variant="secondary" asChild>
					<Link href="/">
						<MoveLeftIcon />
						{t('actions.back_home')}
					</Link>
				</Button>
				<UserTitle user={user} />
			</div>
			<Separator />
			<div className="flex flex-col gap-y-4">
				<p className="text-lg">{t('user.change_info')}:</p>
				<div className="flex flex-col">
					<p className="text-sm text-muted-foreground">{t('common.name')}</p>
					<div className="flex flex-wrap items-center gap-x-2">
						<p className="font-semibold">{user.name}</p>
						<RenameModal
							open={editOpen}
							setOpen={setEditOpen}
							title={t('user.change_name')}
							placeholder={t('auth.name_placeholder')}
							canEdit
							value={value}
							setValue={e => setValue(e.target.value)}
							onSubmit={handleSubmit}
							disabled={isPending}
						>
							<Button variant="ghost" size="iconSm">
								<PencilLineIcon />
							</Button>
						</RenameModal>
					</div>
				</div>
			</div>
			<Button
				size="sm"
				variant="outline"
				asChild
				className="text-xs text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground w-fit transition"
			>
				<Link href="/profile/delete-account">{t('user.delete')}</Link>
			</Button>
		</div>
	);
}
