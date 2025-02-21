import { useRouter } from 'next/navigation';

import { PlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Spinner } from '@/components/common/spinner';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useGetWorkspace } from '../api/use-get-workspace';
import { useGetWorkspaces } from '../api/use-get-workspaces';
import { useCreateWorkspaceModal } from '../hooks/use-create-workspace-modal';
import { useWorkspaceId } from '../hooks/use-workspace-id';

export const WorkspaceSwitcher = () => {
	const t = useTranslations();
	const router = useRouter();
	const workspaceId = useWorkspaceId();
	const [_open, setOpen] = useCreateWorkspaceModal();

	const { workspace, isLoadingWorkspace } = useGetWorkspace({
		workspaceId,
	});
	const { workspaces, isLoadingWorkspaces } = useGetWorkspaces();

	const isLoading = isLoadingWorkspace || isLoadingWorkspaces;

	const filteredWorkspaces =
		workspaces?.filter(workspace => workspace._id !== workspaceId) || [];

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className="w-9 h-9 relative overflow-hidden bg-[#ABABAD] hover:bg-[#ABABAD]/80 text-slate-800  font-semibold text-xl">
					{isLoading ? (
						<Spinner size={5} />
					) : (
						workspace?.name.charAt(0).toUpperCase()
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent side="bottom" align="start" className="w-64">
				<DropdownMenuItem
					onClick={() => router.push(`/workspace/${workspaceId}`)}
					className="cursor-pointer flex flex-col gap-0 justify-start items-start"
				>
					<span>{workspace?.name}</span>
					<span className="text-xs text-muted-foreground">
						{t('workspace.active')}
					</span>
				</DropdownMenuItem>
				{filteredWorkspaces.map(workspace => (
					<DropdownMenuItem
						key={workspace._id}
						onClick={() => router.push(`/workspace/${workspace._id}`)}
						className="cursor-pointer"
					>
						<div className="size-9 relative overflow-hidden text-secondary bg-secondary-foreground font-semibold text-xl rounded-md flex items-center justify-center shrink-0">
							{workspace.name.charAt(0).toUpperCase()}
						</div>
						<span className="truncate">{workspace.name}</span>
					</DropdownMenuItem>
				))}
				<DropdownMenuItem
					onClick={() => setOpen(true)}
					className="cursor-pointer"
				>
					<div className="size-9 relative overflow-hidden bg-secondary text-secondary-foreground font-semibold text-xl rounded-md flex items-center justify-center shrink-0">
						<PlusIcon className="size-6" />
					</div>
					{t('workspace.add')}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
