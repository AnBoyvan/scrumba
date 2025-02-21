import { useRouter } from 'next/navigation';

import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { NotFound } from '@/components/common/not-found';
import { Spinner } from '@/components/common/spinner';
import { UserAvatar } from '@/components/common/user-avatar';
import { MenuHeader } from '@/components/layout/menu-header';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Id } from '@/convex/_generated/dataModel';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useConfirm } from '@/hooks/use-confirm';

import { useCurrentMember } from '../api/use-current-member';
import { useGetMember } from '../api/use-get-member';
import { useRemoveMember } from '../api/use-remove-member';
import { MemberInfo } from './member-info';
import { MemberRole } from './member-role';

interface ProfileProps {
	memberId: Id<'members'>;
	onClose: () => void;
}

export const Profile = ({ memberId, onClose }: ProfileProps) => {
	const t = useTranslations();
	const router = useRouter();
	const workspaceId = useWorkspaceId();
	const [LeaveDialog, confirmLeave] = useConfirm(
		t('workspace.leave'),
		t('workspace.leave_confirm'),
	);
	const [RemoveDialog, confirmRemove] = useConfirm(
		t('workspace.member_remove'),
		t('workspace.member_remove_confirm'),
	);

	const { member: currentMember, isLoadingMember: isLoadingCurrentMember } =
		useCurrentMember({
			workspaceId,
		});
	const { member, isLoadingMember } = useGetMember({
		memberId,
	});

	const { mutate: removeMember } = useRemoveMember();

	const handleRemove = async () => {
		const ok = await confirmRemove();

		if (!ok) return;

		removeMember(
			{ memberId },
			{
				onSuccess: () => {
					toast.success(t('workspace.member_remove_success'));
					onClose();
				},
			},
		);
	};

	const handleLeave = async () => {
		const ok = await confirmLeave();

		if (!ok) return;

		removeMember(
			{ memberId },
			{
				onSuccess: () => {
					router.replace('/');
					toast.success(t('workspace.leave_success'));
					onClose();
				},
			},
		);
	};

	if (isLoadingMember || isLoadingCurrentMember) {
		return (
			<div className="h-full flex flex-col">
				<MenuHeader label={t('common.member')} onClose={onClose} />
				<div className="flex h-full items-center justify-center">
					<Spinner />
				</div>
			</div>
		);
	}

	if (!member) {
		return (
			<div className="h-full flex flex-col">
				<MenuHeader label={t('common.member')} onClose={onClose} />
				<NotFound message={t('user.profile_not_found')} />
			</div>
		);
	}

	return (
		<>
			<LeaveDialog />
			<RemoveDialog />
			<div className="h-full flex flex-col">
				<MenuHeader label={t('common.member')} onClose={onClose} />
				<div className="flex flex-col items-center justify-center p-4">
					<UserAvatar
						name={member.user.name}
						image={member.user.image}
						className="max-w-64 max-h-64 size-full"
						fallbackClassName="aspect-square text-6xl"
					/>
				</div>
				<div className="flex flex-col p-4">
					<p className="text-xl font-bold">{member.user.name}</p>
					{currentMember?.role === 'admin' && currentMember._id !== memberId ? (
						<div className="flex items-center gap-2 mt-4">
							<MemberRole memberId={memberId} current={member.role} />
							<Button
								variant="outline"
								className="w-full"
								onClick={handleRemove}
							>
								{t('actions.remove')}
							</Button>
						</div>
					) : currentMember?._id === memberId &&
					  currentMember.role !== 'admin' ? (
						<Button variant="outline" className="mt-4" onClick={handleLeave}>
							{t('actions.leave')}
						</Button>
					) : null}
				</div>
				<Separator />
				<MemberInfo email={member.user.email} />
			</div>
		</>
	);
};
