import {
	MessageSquareTextIcon,
	PencilIcon,
	SmileIcon,
	TrashIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { EmojiPopover } from '@/components/common/emoji-popover';
import { TooltipButton } from '@/components/common/tooltip-button';
import { Button } from '@/components/ui/button';

interface MessageToolbarProps {
	isAuthor: boolean;
	isPending: boolean;
	handleEdit: () => void;
	handleThread: () => void;
	handleDelete: () => void;
	handleReaction: (value: string) => void;
	hideThreadButton?: boolean;
}

export const MessageToolbar = ({
	isAuthor,
	isPending,
	handleEdit,
	handleDelete,
	handleReaction,
	handleThread,
	hideThreadButton,
}: MessageToolbarProps) => {
	const t = useTranslations();

	return (
		<div className="absolute top-0 right-5">
			<div className="group-hover:opacity-100 opacity-0 transition-opacity border bg-card rounded-md shadow-sm">
				<EmojiPopover
					hint={t('message.emoji')}
					onEmojiSelect={emoji => handleReaction(emoji.native)}
				>
					<Button size="iconSm" variant="ghost" disabled={isPending}>
						<SmileIcon />
					</Button>
				</EmojiPopover>
				{!hideThreadButton && (
					<TooltipButton
						hint={t('message.reply')}
						icon={MessageSquareTextIcon}
						disabled={isPending}
						onClick={handleThread}
					/>
				)}
				{isAuthor && (
					<>
						<TooltipButton
							hint={t('message.edit')}
							icon={PencilIcon}
							disabled={isPending}
							onClick={handleEdit}
						/>
						<TooltipButton
							hint={t('message.delete')}
							icon={TrashIcon}
							disabled={isPending}
							onClick={handleDelete}
						/>
					</>
				)}
			</div>
		</div>
	);
};
