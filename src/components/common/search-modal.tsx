import Link from 'next/link';

import { HashIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
	CommandDialog,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from '@/components/ui/command';
import { Doc } from '@/convex/_generated/dataModel';

import { UserAvatar } from './user-avatar';

interface SearchModalProps {
	open: boolean;
	setOpen: (value: boolean) => void;
	channels?: Doc<'channels'>[];
	members?: (Doc<'members'> & {
		user: Doc<'users'>;
	})[];
}

export const SearchModal = ({
	open,
	setOpen,
	channels,
	members,
}: SearchModalProps) => {
	const t = useTranslations();

	return (
		<CommandDialog open={open} onOpenChange={setOpen}>
			<CommandInput placeholder={t('workspace.search_placeholder')} />
			<CommandList>
				<CommandGroup heading={t('common.channels')}>
					{channels?.map(channel => (
						<CommandItem
							key={channel._id}
							asChild
							onSelect={() => setOpen(false)}
							className="[&_svg]:size-3.5 gap-1"
						>
							<Link
								href={`/workspace/${channel.workspaceId}/channel/${channel._id}`}
							>
								<HashIcon />
								{channel.name}
							</Link>
						</CommandItem>
					))}
				</CommandGroup>
				<CommandSeparator />
				<CommandGroup heading={t('common.members')}>
					{members?.map(member => (
						<CommandItem
							key={member._id}
							asChild
							onSelect={() => setOpen(false)}
						>
							<Link
								href={`/workspace/${member.workspaceId}/member/${member._id}`}
							>
								<UserAvatar
									size="sm"
									name={member.user.name}
									image={member.user.image}
								/>
								<span className="truncate">{member.user.name}</span>
							</Link>
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
		</CommandDialog>
	);
};
