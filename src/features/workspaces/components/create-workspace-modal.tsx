import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useMobileSidebar } from '@/hooks/use-mobile-sidebar';

import { useCreateWorkspace } from '../api/use-create-workspace';
import { useCreateWorkspaceModal } from '../hooks/use-create-workspace-modal';

export const CreateWorkspaceModal = () => {
	const t = useTranslations();
	const router = useRouter();
	const [open, setOpen] = useCreateWorkspaceModal();
	const [_openSidebar, setOpenSidebar] = useMobileSidebar();

	const [name, setName] = useState('');

	const { mutate, isPending } = useCreateWorkspace();

	const handleClose = () => {
		setOpen(false);
		setName('');
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		mutate(
			{ name },
			{
				onSuccess(id) {
					toast.success(t('workspace.created'));
					router.push(`/workspace/${id}`);
					handleClose();
					setOpenSidebar(false);
				},
			},
		);
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent aria-describedby={undefined}>
				<DialogHeader>
					<DialogTitle>{t('workspace.add')}</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<Input
						value={name}
						onChange={e => setName(e.target.value)}
						disabled={isPending}
						required
						minLength={3}
						maxLength={80}
						autoFocus
						placeholder={t('workspace.name')}
					/>
					<div className="flex justify-end">
						<Button type="submit" disabled={isPending}>
							{t('actions.create')}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};
