import { useState } from 'react';

import { ChevronDownIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Doc } from '@/convex/_generated/dataModel';

import { InviteModal } from './invite-modal';
import { PreferencesModal } from './preferences-modal';

interface WorkspaceHeaderProps {
	workspace: Doc<'workspaces'>;
	isAdmin: boolean;
}

export const WorkspaceHeader = ({
	workspace,
	isAdmin,
}: WorkspaceHeaderProps) => {
	const t = useTranslations();

	const [preferencesOpen, setPreferencesOpen] = useState(false);
	const [inviteOpen, setInviteOpen] = useState(false);

	return (
		<>
			<InviteModal
				open={inviteOpen}
				setOpen={setInviteOpen}
				name={workspace.name}
				joinCode={workspace.joinCode}
			/>
			<PreferencesModal
				open={preferencesOpen}
				setOpen={setPreferencesOpen}
				initialValue={workspace.name}
			/>
			<div className="flex items-center w-full justify-between pr-12 lg:pr-4 pl-4 h-[49px] gap-0.5">
				<DropdownMenu>
					<DropdownMenuTrigger asChild className="overflow-hidden">
						<Button
							variant="transparent"
							size="sm"
							className="font-semibold text-lg p-1.5 overflow-hidden  text-slate-200"
						>
							<span className="truncate">{workspace.name}</span>
							<ChevronDownIcon />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent side="bottom" align="start" className="w-64">
						<DropdownMenuItem className="cursor-pointer">
							<div className="size-9 relative overflow-hidden text-secondary bg-secondary-foreground font-semibold text-xl rounded-md flex items-center justify-center shrink-0">
								{workspace.name.charAt(0).toUpperCase()}
							</div>
							<div className="flex flex-col items-start">
								<span className="font-bold">{workspace?.name}</span>
								<span className="text-xs text-muted-foreground">
									{t('workspace.active')}
								</span>
							</div>
						</DropdownMenuItem>
						{isAdmin && (
							<>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									className="cursor-pointer py-2"
									onClick={() => setInviteOpen(true)}
								>
									<span className="truncate">
										{`${t('actions.invite_to')}
												${workspace.name}`}
									</span>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									className="cursor-pointer py-2"
									onClick={() => setPreferencesOpen(true)}
								>
									{t('common.preferences')}
								</DropdownMenuItem>
							</>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</>
	);
};
