import { useTranslations } from 'next-intl';

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { Doc } from '@/convex/_generated/dataModel';

import { OnlyAdminWorkspaceMembers } from './only-admin-workspace-members';

interface OnlyAdminWorkspacesProps {
	workspaces: (Doc<'workspaces'> & {
		members: (Doc<'members'> & {
			name?: string;
			image?: string;
		})[];
	})[];
}

export const OnlyAdminWorkspaces = ({
	workspaces,
}: OnlyAdminWorkspacesProps) => {
	const t = useTranslations();

	return (
		<div className="flex flex-col w-full">
			<p>{t('common.workspaces')}:</p>
			<Accordion type="single" collapsible className="w-full">
				{workspaces.map(workspace => (
					<AccordionItem
						key={workspace._id}
						value={workspace._id}
						className="w-full"
					>
						<AccordionTrigger className="px-0 py-2 w-full">
							<div className="flex-1 flex items-center justify-start gap-x-2  overflow-hidden mr-2">
								<div className="size-9 relative overflow-hidden text-secondary bg-secondary-foreground font-semibold text-xl rounded-md flex items-center justify-center shrink-0">
									{workspace.name.charAt(0).toUpperCase()}
								</div>
								<span className="truncate">{workspace.name}</span>
							</div>
						</AccordionTrigger>
						<AccordionContent>
							<OnlyAdminWorkspaceMembers workspace={workspace} />
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</div>
	);
};
