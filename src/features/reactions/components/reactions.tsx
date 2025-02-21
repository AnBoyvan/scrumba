import { useTranslations } from 'next-intl';
import { MdOutlineAddReaction } from 'react-icons/md';

import { EmojiPopover } from '@/components/common/emoji-popover';
import { Hint } from '@/components/common/hint';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { cn } from '@/lib/utils';

interface ReactionProps {
	data: Array<
		Omit<Doc<'reactions'>, 'memberId'> & {
			count: number;
			memberIds: Id<'members'>[];
		}
	>;
	onChange: (value: string) => void;
}

export const Reactions = ({ data, onChange }: ReactionProps) => {
	const t = useTranslations();
	const workspaceId = useWorkspaceId();

	const { member } = useCurrentMember({ workspaceId });

	const memberId = member?._id;

	if (data.length === 0 || !memberId) {
		return null;
	}

	return (
		<div className="flex items-center gap-1 my-1 flex-wrap">
			{data.map(reaction => (
				<Hint
					key={reaction._id}
					label={`${reaction.count}${t(reaction.count === 1 ? 'message.reacted_single' : 'message.reacted_plural')}${reaction.value}`}
				>
					<button
						className={cn(
							'h-6 px-2 rounded-full bg-slate-200/70 dark:bg-slate-800/70 border border-transparent text-slate-800 dark:text-slate-200 flex items-center gap-x-1 text-xs',
							reaction.memberIds.includes(member._id) &&
								'bg-blue-100/70 dark:bg-blue-950/70  border-blue-500 dark:border-blue-800',
						)}
						onClick={() => onChange(reaction.value)}
					>
						{reaction.value}
						<span
							className={cn(
								'text-xs font-semibold text-muted-foreground',
								reaction.memberIds.includes(member._id) &&
									'text-blue-700 dark:text-blue-500',
							)}
						>
							{reaction.count}
						</span>
					</button>
				</Hint>
			))}
			<EmojiPopover
				hint={t('message.add_reaction')}
				onEmojiSelect={emoji => onChange(emoji.native)}
			>
				<button>
					<div className="h-7 px-3 rounded-full bg-slate-200/70 dark:bg-slate-800/70 border border-transparent hover:border-slate-500 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200 transition flex items-center gap-x-1">
						<MdOutlineAddReaction className="shrink-0" />
					</div>
				</button>
			</EmojiPopover>
		</div>
	);
};
