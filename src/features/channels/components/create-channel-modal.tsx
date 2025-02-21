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
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useMobileSidebar } from '@/hooks/use-mobile-sidebar';

import { useCreateChannel } from '../api/use-create-channel';
import { useCreateChannelModal } from '../hooks/use-create-channel-modal';

export const CreateChannelModal = () => {
	const t = useTranslations();
	const router = useRouter();
	const workspaceId = useWorkspaceId();
	const [open, setOpen] = useCreateChannelModal();
	const [_openSidebar, setOpenSidebar] = useMobileSidebar();

	const [name, setName] = useState('');

	const { mutate, isPending } = useCreateChannel();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/\s+/g, '-').toLowerCase();
		setName(value);
	};

	const handleClose = () => {
		setName('');
		setOpen(false);
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		mutate(
			{ name, workspaceId },
			{
				onSuccess(id) {
					toast.success(t('channel.created'));
					router.push(`/workspace/${workspaceId}/channel/${id}`);
					setOpenSidebar(false);
					handleClose();
				},
			},
		);
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent aria-describedby={undefined}>
				<DialogHeader>
					<DialogTitle>{t('channel.add')}</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<Input
						value={name}
						onChange={handleChange}
						disabled={isPending}
						required
						minLength={3}
						maxLength={80}
						autoFocus
						placeholder={t('channel.name_placeholder')}
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
