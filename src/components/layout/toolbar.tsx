import { useState } from 'react';

import { PanelLeftIcon, SearchIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { useGetChannels } from '@/features/channels/api/use-get-channels';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useMobileSidebar } from '@/hooks/use-mobile-sidebar';

import { SearchModal } from '../common/search-modal';
import { MobileSidebar } from './mobile-sidebar';

export const Toolbar = () => {
	const t = useTranslations();
	const workspaceId = useWorkspaceId();
	const [_open, setOpen] = useMobileSidebar();

	const [isOpen, setIsOpen] = useState(false);

	const { workspace } = useGetWorkspace({ workspaceId });
	const { channels } = useGetChannels({ workspaceId });
	const { members } = useGetMembers({ workspaceId });

	return (
		<>
			<SearchModal
				open={isOpen}
				setOpen={setIsOpen}
				channels={channels}
				members={members}
			/>
			<MobileSidebar />
			<nav className="bg-blue-900  flex items-center justify-between lg:justify-center gap-x-4 h-10 py-1.5 px-2">
				<Button
					variant="ghost"
					size="iconSm"
					onClick={() => setOpen(true)}
					className="shrink-0 lg:hidden text-slate-200"
				>
					<PanelLeftIcon />
				</Button>
				<div className="min-w-[250px] max-w-[642px] grow-[2] shrink">
					<Button
						size="sm"
						className="bg-accent/25 hover:bg-accent/30 w-full justify-start h-7 px-2 text-slate-200"
						onClick={() => setIsOpen(true)}
					>
						<SearchIcon />
						<span className="text-xs">
							{t('common.search')}&nbsp;{workspace?.name}
						</span>
					</Button>
				</div>
			</nav>
		</>
	);
};
