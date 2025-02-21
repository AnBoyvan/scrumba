import { useRouter } from 'next/navigation';

import { CopyIcon, RefreshCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { useConfirm } from '@/hooks/use-confirm';

import { useNewJoinCode } from '../api/use-new-join-code';
import { useWorkspaceId } from '../hooks/use-workspace-id';

interface InviteModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	name: string;
	joinCode: string;
}

export const InviteModal = ({
	open,
	setOpen,
	name,
	joinCode,
}: InviteModalProps) => {
	const t = useTranslations();
	const workspaceId = useWorkspaceId();
	const router = useRouter();
	const [ConfirmDialog, confirm] = useConfirm(
		t('common.sure'),
		t('workspace.new_code_alert'),
	);

	const { mutate, isPending } = useNewJoinCode();

	const handleCopy = () => {
		const inviteLink = `${window.location.origin}/join/${workspaceId}`;

		navigator.clipboard
			.writeText(inviteLink)
			.then(() => toast.success(t('workspace.link_copied')));
	};

	const handleNewCode = async () => {
		const ok = await confirm();

		if (!ok) {
			return;
		}

		mutate(
			{ workspaceId },
			{
				onSuccess: () => {
					toast.success(t('workspace.new_code_gen'));
				},
			},
		);
	};

	return (
		<>
			<ConfirmDialog />
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{t('workspace.invite')}
							{name}
						</DialogTitle>
						<DialogDescription>{t('workspace.use_code')}</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col gap-y-4 items-center justify-center py-10">
						<p className="text-4xl font-bold tracking-widest uppercase">
							{joinCode}
						</p>
						<Button size="sm" variant="ghost" onClick={handleCopy}>
							{t('workspace.copy_link')}
							<CopyIcon />
						</Button>
					</div>
					<div className="flex items-center justify-between w-full">
						<Button
							variant="outline"
							disabled={isPending}
							onClick={handleNewCode}
						>
							{t('workspace.new_code')}
							<RefreshCcw />
						</Button>
						<DialogClose asChild>
							<Button>{t('actions.close')}</Button>
						</DialogClose>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};
