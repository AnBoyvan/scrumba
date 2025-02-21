'use client';

import { usePathname, useRouter } from 'next/navigation';

import { HomeIcon, MessagesSquareIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { UserButton } from '@/features/auth/components/user-button';
import { WorkspaceSwitcher } from '@/features/workspaces/components/workspace-switcher';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useMobileSidebar } from '@/hooks/use-mobile-sidebar';

import { SidebarButton } from './sidebar-button';

export const Sidebar = () => {
	const t = useTranslations();
	const pathname = usePathname();
	const router = useRouter();
	const workspaceId = useWorkspaceId();
	const [_open, setOpen] = useMobileSidebar();

	return (
		<aside className="w-[70px] min-w-[70px] h-full bg-blue-900 flex flex-col gap-y-4 items-center pt-4 lg:pt-[9px] pb-4">
			<WorkspaceSwitcher />
			<SidebarButton
				icon={HomeIcon}
				label={t('common.home')}
				isActive={
					pathname.includes('/workspace') && !pathname.includes('/member')
				}
				onClick={() => {
					setOpen(false);
					router.push(`/workspace/${workspaceId}`);
				}}
			/>
			<SidebarButton
				icon={MessagesSquareIcon}
				label={t('common.dms')}
				onClick={() => {
					setOpen(false);
					router.push(`/workspace/${workspaceId}/member`);
				}}
				isActive={pathname.includes('/member')}
			/>
			<div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
				<UserButton />
			</div>
		</aside>
	);
};
