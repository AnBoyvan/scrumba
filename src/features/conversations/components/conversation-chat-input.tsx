import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';

import { useTranslations } from 'next-intl';
import type Quill from 'quill';
import { toast } from 'sonner';

import { Id } from '@/convex/_generated/dataModel';
import { useCreateMessage } from '@/features/messages/api/use-create-message';
import { uploadImage } from '@/features/upload/api/upload-image';
import { useGenerateUploadUrl } from '@/features/upload/api/use-generate-upload-url';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';

const Editor = dynamic(() => import('@/components/common/editor'), {
	ssr: false,
});

interface CreateMessageValues {
	conversationId: Id<'conversations'>;
	workspaceId: Id<'workspaces'>;
	body: string;
	image?: Id<'_storage'>;
}

interface ConversationChatInputProps {
	placeholder: string;
	conversationId: Id<'conversations'>;
}

export const ConversationChatInput = ({
	placeholder,
	conversationId,
}: ConversationChatInputProps) => {
	const t = useTranslations();
	const editorRef = useRef<Quill | null>(null);
	const workspaceId = useWorkspaceId();

	const [editorKey, setEditorKey] = useState(0);
	const [isPending, setIsPending] = useState(false);

	const { mutate: generateUploadUrl } = useGenerateUploadUrl();
	const { mutate: createMessage } = useCreateMessage();

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
				conversationId,
				workspaceId,
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

	return (
		<div className="px-5 w-full">
			<Editor
				key={editorKey}
				placeholder={placeholder}
				onSubmit={handleSubmit}
				disabled={isPending}
				innerRef={editorRef}
			/>
		</div>
	);
};
