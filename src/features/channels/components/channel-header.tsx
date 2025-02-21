import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { TrashIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FaChevronDown } from 'react-icons/fa';
import { toast } from 'sonner';

import { RenameModal } from '@/components/common/rename-modal';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useConfirm } from '@/hooks/use-confirm';

import { useRemoveChannel } from '../api/use-remove-channel';
import { useUpdateChannel } from '../api/use-update-channel';
import { useChannelId } from '../hooks/use-channel-id';

interface ChannelHeaderProps {
	title: string;
}

export const ChannelHeader = ({ title }: ChannelHeaderProps) => {
	const t = useTranslations();
	const router = useRouter();
	const channelId = useChannelId();
	const workspaceId = useWorkspaceId();
	const [ConfirmDialog, confirm] = useConfirm(
		t('common.sure'),
		t('common.irreversible'),
	);

	const [value, setValue] = useState(title);
	const [editOpen, setEditOpen] = useState(false);

	const { member } = useCurrentMember({ workspaceId });
	const { mutate: updateChannel, isPending: isUpdatingChannel } =
		useUpdateChannel();
	const { mutate: removeChannel, isPending: isRemovingChannel } =
		useRemoveChannel();

	const handleEditOpen = () => {
		if (member?.role !== 'admin') {
			return;
		}
		setEditOpen(true);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const edied = e.target.value.replace(/\s+/g, '-').toLowerCase();
		setValue(edied);
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (value === title) {
			setEditOpen(false);
			return;
		}

		updateChannel(
			{ name: value, channelId },
			{
				onSuccess: () => {
					toast.success(t('channel.updated'));
					setEditOpen(false);
				},
			},
		);
	};

	const handleRemove = async () => {
		const ok = await confirm();
		if (!ok) {
			return;
		}
		removeChannel(
			{ channelId },
			{
				onSuccess: () => {
					toast.success(t('channel.deleted'));
					router.replace(`/workspace/${workspaceId}`);
				},
			},
		);
	};

	return (
		<>
			<ConfirmDialog />
			<div className="bg-card border-b h-[49px] flex items-center px-4 overflow-hidden">
				<Dialog>
					<DialogTrigger asChild>
						<Button
							size="sm"
							variant="ghost"
							className="text-lg font-semibold px-2 overflow-hidden w-auto [&_svg]:size-2.5"
						>
							<span className="truncate"># {title}</span>
							<FaChevronDown />
						</Button>
					</DialogTrigger>
					<DialogContent
						aria-describedby={undefined}
						className="p-0 overflow-hidden"
					>
						<DialogHeader className="p-4 border-b bg-card">
							<DialogTitle># {title}</DialogTitle>
						</DialogHeader>
						<div className="px-4 pb-4 flex flex-col gap-y-2">
							<RenameModal
								open={editOpen}
								setOpen={setEditOpen}
								trigger={t('channel.name')}
								title={t('channel.rename')}
								name={`# ${title}`}
								placeholder={t('channel.name_placeholder')}
								canEdit={member?.role === 'admin'}
								value={value}
								setValue={handleChange}
								onSubmit={handleSubmit}
								disabled={isUpdatingChannel}
							/>
							{member?.role === 'admin' && (
								<button
									disabled={isRemovingChannel}
									onClick={handleRemove}
									className="flex items-center gap-x-2 px-5 py-4 bg-card rounded-lg border hover:bg-accent text-destructive transition"
								>
									<TrashIcon className="size-4" />
									<p className="text-sm font-semibold">{t('channel.delete')}</p>
								</button>
							)}
						</div>
					</DialogContent>
				</Dialog>
			</div>
		</>
	);
};
