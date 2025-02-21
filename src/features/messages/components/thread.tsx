import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';

import { differenceInMinutes } from 'date-fns';
import { useTranslations } from 'next-intl';
import type Quill from 'quill';
import { toast } from 'sonner';

import { NotFound } from '@/components/common/not-found';
import { Observer } from '@/components/common/observer';
import { Spinner } from '@/components/common/spinner';
import { MenuHeader } from '@/components/layout/menu-header';
import { Id } from '@/convex/_generated/dataModel';
import { useChannelId } from '@/features/channels/hooks/use-channel-id';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { uploadImage } from '@/features/upload/api/upload-image';
import { useGenerateUploadUrl } from '@/features/upload/api/use-generate-upload-url';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useDateFormatter } from '@/hooks/use-date-formatter';

import { useCreateMessage } from '../api/use-create-message';
import { useGetMessage } from '../api/use-get-message';
import { useGetMessages } from '../api/use-get-messages';
import { MESSAGES_TIME_THRESHOLD } from '../constants';
import { getGroupedMessages } from '../utils/get-grouped-messages';
import { Message } from './message';
import { MessagesSeparator } from './messages-separtor';

const Editor = dynamic(() => import('@/components/common/editor'), {
	ssr: false,
});

interface ThreadProps {
	messageId: Id<'messages'>;
	onClose: () => void;
}

interface CreateMessageValues {
	channelId: Id<'channels'>;
	workspaceId: Id<'workspaces'>;
	parentMessageId: Id<'messages'>;
	body: string;
	image?: Id<'_storage'>;
}

export const Thread = ({ messageId, onClose }: ThreadProps) => {
	const t = useTranslations();
	const workspaceId = useWorkspaceId();
	const channelId = useChannelId();
	const { formatDateLabel } = useDateFormatter();

	const [editingId, setEditingId] = useState<Id<'messages'> | null>(null);
	const [editorKey, setEditorKey] = useState(0);
	const [isPending, setIsPending] = useState(false);

	const editorRef = useRef<Quill | null>(null);

	const { member } = useCurrentMember({ workspaceId });
	const { message, isLoadingMessage } = useGetMessage({
		messageId,
	});
	const { results, status, loadMore } = useGetMessages({
		channelId,
		parentMessageId: messageId,
	});

	const { mutate: generateUploadUrl } = useGenerateUploadUrl();
	const { mutate: createMessage } = useCreateMessage();

	const canLoadMore = status === 'CanLoadMore';
	const isLoadingMore = status === 'LoadingMore';

	const groupedMessages = getGroupedMessages(results);

	const handleSubmit = async ({
		body,
		image,
	}: {
		body: string;
		image: File | null;
	}) => {
		try {
			setIsPending(true);
			editorRef.current?.enable(false);

			const values: CreateMessageValues = {
				channelId,
				workspaceId,
				parentMessageId: messageId,
				body,
				image: undefined,
			};

			if (image) {
				const url = await generateUploadUrl({}, { throwError: true });
				values.image = await uploadImage({ image, url });
			}

			await createMessage(values, { throwError: true });

			setEditorKey(prevKey => prevKey + 1);
		} catch (error) {
			toast.error(t('message.send_err'));
		} finally {
			setIsPending(false);
			editorRef.current?.enable(true);
		}
	};

	if (isLoadingMessage || status === 'LoadingFirstPage') {
		return (
			<div className="h-full flex flex-col">
				<MenuHeader label={t('common.thread')} onClose={onClose} />
				<div className="flex h-full items-center justify-center">
					<Spinner />
				</div>
			</div>
		);
	}

	if (!message) {
		return (
			<div className="h-full flex flex-col">
				<MenuHeader label={t('common.thread')} onClose={onClose} />
				<NotFound message={t('message.not_found')} />
			</div>
		);
	}

	return (
		<div className="h-full flex flex-col">
			<MenuHeader label={t('common.thread')} onClose={onClose} />
			<div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
				{Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
					<div key={dateKey}>
						<MessagesSeparator content={formatDateLabel(dateKey)} />
						{messages.map((message, idx) => {
							const prevMessage = messages[idx - 1];
							const isCompact =
								prevMessage &&
								prevMessage.user?._id &&
								differenceInMinutes(
									new Date(message._creationTime),
									new Date(prevMessage._creationTime),
								) < MESSAGES_TIME_THRESHOLD;

							return (
								<Message
									key={message._id}
									messageId={message._id}
									memberId={message.memberId}
									authorImage={message.user.image}
									authorName={message.user.name}
									isAuthor={message.memberId === member?._id}
									reactions={message.reactions}
									body={message.body}
									image={message.image}
									updatedAt={message.updatedAt}
									createdAt={message._creationTime}
									isEditing={editingId === message._id}
									setEditingId={setEditingId}
									isCompact={isCompact}
									hideThreadButton
									threadCount={message.threadCount}
									threadImage={message.threadImage}
									threadName={message.threadName}
									treadTimeStamp={message.threadTimeStamp}
								/>
							);
						})}
					</div>
				))}
				<Observer condition={canLoadMore} onIntersect={loadMore} />
				{isLoadingMore && <MessagesSeparator content={<Spinner size={4} />} />}
				<Message
					hideThreadButton
					memberId={message.memberId}
					authorImage={message.user.image}
					authorName={message.user.name}
					isAuthor={message.memberId === member?._id}
					body={message.body}
					image={message.image}
					createdAt={message._creationTime}
					updatedAt={message.updatedAt}
					messageId={message._id}
					reactions={message.reactions}
					isEditing={editingId === message._id}
					setEditingId={setEditingId}
				/>
			</div>
			<div className="px-4">
				<Editor
					key={editorKey}
					onSubmit={handleSubmit}
					disabled={isPending}
					placeholder={`${t('actions.reply')}...`}
					innerRef={editorRef}
				/>
			</div>
		</div>
	);
};
