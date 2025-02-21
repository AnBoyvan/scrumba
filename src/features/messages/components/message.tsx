import dynamic from 'next/dynamic';

import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Hint } from '@/components/common/hint';
import { Thumbnail } from '@/components/common/thumbnail';
import { UserAvatar } from '@/components/common/user-avatar';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { useToggleReaction } from '@/features/reactions/api/use-update-message';
import { Reactions } from '@/features/reactions/components/reactions';
import { useConfirm } from '@/hooks/use-confirm';
import { useDateFormatter } from '@/hooks/use-date-formatter';
import { usePanel } from '@/hooks/use-panel';
import { cn } from '@/lib/utils';

import { useRemoveMessage } from '../api/use-remove-message';
import { useUpdateMessage } from '../api/use-update-message';
import { MessageToolbar } from './message-toolbar';
import { ThreadBar } from './thread-bar';

const Renderer = dynamic(() => import('@/components/common/renderer'), {
	ssr: false,
});
const Editor = dynamic(() => import('@/components/common/editor'), {
	ssr: false,
});

interface MessageProps {
	messageId: Id<'messages'>;
	memberId: Id<'members'>;
	authorImage?: string;
	authorName?: string;
	isAuthor: boolean;
	reactions: Array<
		Omit<Doc<'reactions'>, 'memberId'> & {
			count: number;
			memberIds: Id<'members'>[];
		}
	>;
	body: Doc<'messages'>['body'];
	image: string | null | undefined;
	updatedAt: Doc<'messages'>['updatedAt'];
	createdAt: Doc<'messages'>['_creationTime'];
	isEditing: boolean;
	setEditingId: (id: Id<'messages'> | null) => void;
	isCompact?: boolean;
	hideThreadButton?: boolean;
	threadCount?: number;
	threadImage?: string;
	threadName?: string;
	treadTimeStamp?: number;
}

export const Message = ({
	messageId,
	memberId,
	authorName = 'User',
	authorImage,
	isAuthor,
	reactions,
	body,
	image,
	updatedAt,
	createdAt,
	isEditing,
	setEditingId,
	isCompact,
	hideThreadButton,
	threadCount,
	threadImage,
	threadName,
	treadTimeStamp,
}: MessageProps) => {
	const t = useTranslations();
	const { formatDateKey, formatFullTime, formatTime } = useDateFormatter();
	const [ConfirmDialog, confirm] = useConfirm(
		t('message.delete'),
		t('message.delete_warn'),
	);
	const { parentMessageId, onOpenMessage, onOpenProfile, onClose } = usePanel();

	const { mutate: updateMessage, isPending: isUpdatingMessage } =
		useUpdateMessage();
	const { mutate: removeMessage, isPending: isRemovingMessage } =
		useRemoveMessage();
	const { mutate: toggleReaction, isPending: isTogglingReaction } =
		useToggleReaction();

	const isPending =
		isUpdatingMessage || isRemovingMessage || isTogglingReaction;

	const handleUpdate = ({ body }: { body: string }) => {
		updateMessage(
			{ messageId, body },
			{
				onSuccess: () => {
					toast.success(t('message.update_success'));
					setEditingId(null);
				},
			},
		);
	};

	const handleRemove = async () => {
		const ok = await confirm();

		if (!ok) return;

		removeMessage(
			{ messageId },
			{
				onSuccess: () => {
					toast.success(t('message.remove_success'));

					if (parentMessageId === messageId) {
						onClose();
					}
				},
			},
		);
	};

	const handleReaction = (value: string) => {
		toggleReaction({ messageId, value });
	};

	return (
		<>
			<ConfirmDialog />
			<div
				className={cn(
					'flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 dark:hover:bg-gray-900/60 group relative',
					isEditing &&
						'bg-yellow-300/20 hover:bg-yellow-300/20 dark:hover:bg-yellow-300/20',
					isRemovingMessage &&
						'bg-destructive/50 hover:destructive/50 transform transition-all scale-y-0 origin-bottom duration-200',
				)}
			>
				<div className="flex items-start gap-2">
					{isCompact ? (
						<Hint label={formatFullTime(new Date(createdAt))}>
							<button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-10 leading-[22px] text-center hover:underline shrink-0">
								{formatDateKey(new Date(createdAt), 'HH:mm')}
							</button>
						</Hint>
					) : (
						<button onClick={() => onOpenProfile(memberId)}>
							<UserAvatar name={authorName} image={authorImage} />
						</button>
					)}
					{isEditing ? (
						<div className="w-full h-full">
							<Editor
								onSubmit={handleUpdate}
								disabled={isPending}
								defaultValue={JSON.parse(body)}
								onCancel={() => setEditingId(null)}
								variant="update"
							/>
						</div>
					) : (
						<div className="flex flex-col w-full overflow-hidden">
							{!isCompact && (
								<div className="text-sm">
									<button
										onClick={() => onOpenProfile(memberId)}
										className="font-bold hover:underline"
									>
										{authorName}
									</button>
									<span>&nbsp;&nbsp;</span>
									<Hint label={formatFullTime(new Date(createdAt))}>
										<button className="text-xs text-muted-foreground hover:underline">
											{formatTime(new Date(createdAt))}
										</button>
									</Hint>
								</div>
							)}
							<Thumbnail url={image} />
							<Renderer value={body} />
							{updatedAt ? (
								<span className="text-xs text-muted-foreground">
									({t('common.edited')})
								</span>
							) : null}
							<Reactions data={reactions} onChange={handleReaction} />
							<ThreadBar
								count={threadCount}
								image={threadImage}
								name={threadName}
								timestamp={treadTimeStamp}
								onClick={() => onOpenMessage(messageId)}
							/>
						</div>
					)}
				</div>
				{!isEditing && (
					<MessageToolbar
						isAuthor={isAuthor}
						isPending={isPending}
						handleEdit={() => setEditingId(messageId)}
						handleThread={() => onOpenMessage(messageId)}
						handleDelete={handleRemove}
						handleReaction={handleReaction}
						hideThreadButton={hideThreadButton}
					/>
				)}
			</div>
		</>
	);
};
