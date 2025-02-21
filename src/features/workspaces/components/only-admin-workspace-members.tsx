'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { PlusIcon, Trash2Icon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { UserAvatar } from '@/components/common/user-avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { useUpdateMember } from '@/features/members/api/use-update-member';
import { useConfirm } from '@/hooks/use-confirm';

import { useRemoveWorkspace } from '../api/use-remove-workspace';

interface OnlyAdminWorkspaceMembersProps {
	workspace: Doc<'workspaces'> & {
		members: (Doc<'members'> & {
			name?: string;
			image?: string;
		})[];
	};
}

export const OnlyAdminWorkspaceMembers = ({
	workspace,
}: OnlyAdminWorkspaceMembersProps) => {
	const t = useTranslations();
	const router = useRouter();
	const [ConfirmDialog, confirm] = useConfirm(
		t('common.sure'),
		t('common.irreversible'),
	);

	const [selected, setSelected] = useState<Id<'members'>[]>([]);

	const { mutate: updateMember, isPending: isUpdatingMember } =
		useUpdateMember();
	const { mutate: removeWorkspace, isPending: isRemovingWorkspace } =
		useRemoveWorkspace();

	const handleSelect = (value: Id<'members'>) => {
		const isChecked = selected.includes(value);

		if (isChecked) {
			setSelected(selected.filter(item => item !== value));
		} else {
			setSelected([...selected, value]);
		}
	};

	const handleAddAdmins = () => {
		if (selected.length === 0) return;
		selected.map(id => updateMember({ memberId: id, role: 'admin' }));
	};

	const handleRemove = async () => {
		const ok = await confirm();

		if (!ok) {
			return;
		}

		removeWorkspace(
			{ workspaceId: workspace._id },
			{
				onSuccess: () => {
					toast.success(t('workspace.deleted'));
				},
			},
		);
	};

	return (
		<>
			<ConfirmDialog />
			<div className="flex flex-col gap-y-2 w-full">
				{workspace.members.length !== 0 ? (
					<Button
						size="sm"
						variant="secondary"
						disabled={selected.length === 0 || isUpdatingMember}
						onClick={handleAddAdmins}
						className="mr-auto"
					>
						<PlusIcon />
						{t('actions.add')}
					</Button>
				) : (
					<Button
						variant="destructive"
						size="sm"
						onClick={handleRemove}
						className="ml-auto"
					>
						<Trash2Icon />
						{t('workspace.remove_button')}
					</Button>
				)}
				{workspace.members.map(member => (
					<div
						key={member._id}
						className="flex items-center gap-x-2 px-2 w-full"
					>
						<Checkbox
							id={member._id}
							checked={selected?.includes(member._id)}
							onCheckedChange={() => handleSelect(member._id)}
							className="border-border bg-background"
						/>
						<label
							htmlFor={member._id}
							className="cursor-pointer flex items-center gap-x-2 text-sm py-1 w-full "
						>
							<UserAvatar size="sm" name={member.name} image={member.image} />
							<span className="truncate">{member.name}</span>
						</label>
					</div>
				))}
			</div>
		</>
	);
};
