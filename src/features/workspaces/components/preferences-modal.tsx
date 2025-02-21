import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { TrashIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { RenameModal } from '@/components/common/rename-modal';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { useConfirm } from '@/hooks/use-confirm';
import { useMobileSidebar } from '@/hooks/use-mobile-sidebar';

import { useRemoveWorkspace } from '../api/use-remove-workspace';
import { useUpdateWorkspace } from '../api/use-update-workspace';
import { useWorkspaceId } from '../hooks/use-workspace-id';

interface PreferencesModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	initialValue: string;
}

export const PreferencesModal = ({
	open,
	setOpen,
	initialValue,
}: PreferencesModalProps) => {
	const t = useTranslations();
	const workspaceId = useWorkspaceId();
	const router = useRouter();
	const [_openSidebar, setOpenSidebar] = useMobileSidebar();
	const [ConfirmDialog, confirm] = useConfirm(
		t('common.sure'),
		t('common.irreversible'),
	);

	const [value, setValue] = useState(initialValue);
	const [editOpen, setEditOpen] = useState(false);

	const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } =
		useUpdateWorkspace();
	const { mutate: removeWorkspace, isPending: isRemovingWorkspace } =
		useRemoveWorkspace();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (initialValue === value) {
			setEditOpen(false);
			return;
		}

		updateWorkspace(
			{ workspaceId, name: value },
			{
				onSuccess: () => {
					setEditOpen(false);
					toast.success(t('workspace.updated'));
				},
			},
		);
	};

	const handleRemove = async () => {
		const ok = await confirm();

		if (!ok) {
			return;
		}

		removeWorkspace(
			{ workspaceId },
			{
				onSuccess: () => {
					toast.success(t('workspace.deleted'));
					router.replace('/');
					setOpenSidebar(false);
				},
			},
		);
	};

	return (
		<>
			<ConfirmDialog />
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent
					aria-describedby={undefined}
					className="p-0 overflow-hidden"
				>
					<DialogHeader className="p-4 border-b bg-card">
						<DialogTitle>{value}</DialogTitle>
					</DialogHeader>
					<div className="px-4 pb-4 flex flex-col gap-y-2">
						<RenameModal
							open={editOpen}
							setOpen={setEditOpen}
							trigger={t('workspace.name')}
							title={t('workspace.rename')}
							name={initialValue}
							placeholder={t('workspace.name')}
							canEdit
							value={value}
							setValue={e => setValue(e.target.value)}
							onSubmit={handleSubmit}
							disabled={isUpdatingWorkspace}
						/>
						<button
							disabled={isRemovingWorkspace}
							onClick={() => handleRemove()}
							className="flex items-center gap-x-2 px-5 py-4 bg-card rounded-lg border hover:bg-accent text-destructive"
						>
							<TrashIcon className="size-4" />
							<p className="text-sm font-semibold">{t('workspace.delete')}</p>
						</button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};
