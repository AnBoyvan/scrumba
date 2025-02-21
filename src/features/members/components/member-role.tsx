import { ChevronDownIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { useConfirm } from '@/hooks/use-confirm';

import { useUpdateMember } from '../api/use-update-member';

interface MemberRoleProps {
	memberId: Id<'members'>;
	current: Doc<'members'>['role'];
}

export const MemberRole = ({ memberId, current }: MemberRoleProps) => {
	const t = useTranslations();
	const [UpdateDialog, confirmUpdate] = useConfirm(
		t('workspace.role_change'),
		t('workspace.role_change_confirm'),
	);

	const { mutate } = useUpdateMember();

	const handleUpdate = async (role: 'admin' | 'member') => {
		const ok = await confirmUpdate();

		if (!ok) return;

		mutate(
			{ memberId, role },
			{
				onSuccess: () => {
					toast.success(t('workspace.role_change_success'));
				},
			},
		);
	};

	return (
		<>
			<UpdateDialog />
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" className="capitalize w-full">
						{t(`common.${current}`)}
						<ChevronDownIcon />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-full">
					<DropdownMenuRadioGroup
						value={current}
						onValueChange={value => handleUpdate(value as 'admin' | 'member')}
					>
						<DropdownMenuRadioItem value="admin" className="text-md">
							{t('common.admin')}
						</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="member" className="text-md">
							{t('common.member')}
						</DropdownMenuRadioItem>
					</DropdownMenuRadioGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
};
