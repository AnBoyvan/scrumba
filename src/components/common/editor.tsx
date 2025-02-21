import Image from 'next/image';
import { RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { ImageIcon, SmileIcon, XIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Quill from 'quill';
import { Delta, Op, type QuillOptions } from 'quill/core';
import 'quill/dist/quill.snow.css';
import { MdSend } from 'react-icons/md';
import { PiTextAa } from 'react-icons/pi';

import { Hint } from '@/components/common/hint';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import '@/styles/quill.css';

import { EmojiPopover } from './emoji-popover';
import { TooltipButton } from './tooltip-button';

type EditorValue = {
	image: File | null;
	body: string;
};

interface EditorProps {
	onSubmit: ({ image, body }: EditorValue) => void;
	onCancel?: () => void;
	placeholder?: string;
	defaultValue?: Delta | Op[];
	disabled?: boolean;
	innerRef?: RefObject<Quill | null>;
	variant?: 'create' | 'update';
}

const Editor = ({
	onCancel,
	onSubmit,
	placeholder = '...',
	defaultValue = [],
	disabled = false,
	innerRef,
	variant = 'create',
}: EditorProps) => {
	const t = useTranslations();

	const [text, setText] = useState('');
	const [image, setImage] = useState<File | null>(null);
	const [isToolbarVisible, setIsToolbarVisible] = useState(true);

	const submitRef = useRef(onSubmit);
	const placeholderRef = useRef(placeholder);
	const quillRef = useRef<Quill | null>(null);
	const defaultValueRef = useRef(defaultValue);
	const containerRef = useRef<HTMLDivElement>(null);
	const disabledRef = useRef(disabled);
	const imageElementRef = useRef<HTMLInputElement>(null);

	useLayoutEffect(() => {
		submitRef.current = onSubmit;
		placeholderRef.current = placeholder;
		defaultValueRef.current = defaultValue;
		disabledRef.current = disabled;
	});

	useEffect(() => {
		if (!containerRef.current) return;

		const container = containerRef.current;
		const editorContainer = container.appendChild(
			container.ownerDocument.createElement('div'),
		);

		const options: QuillOptions = {
			theme: 'snow',
			placeholder: placeholderRef.current,
			modules: {
				toolbar: [
					['bold', 'italic', 'underline', 'strike'],
					[{ list: 'ordered' }, { list: 'bullet' }],
					['clean'],
				],
				keyboard: {
					bindings: {
						enter: {
							key: 'Enter',
							handler: () => {
								const text = quill.getText();
								const addedImage = imageElementRef.current?.files?.[0] || null;
								const isEmpty =
									!addedImage &&
									text.replace(/<(.|\n)*?>/g, '').trim().length === 0;

								if (isEmpty) return;

								const body = JSON.stringify(quill.getContents());

								submitRef.current?.({ body, image: addedImage });

								return;
							},
						},
						shift_enter: {
							key: 'Enter',
							shiftKey: true,
							handler: () => {
								quill.insertText(quill.getSelection()?.index || 0, '\n');
							},
						},
					},
				},
			},
		};

		const quill = new Quill(editorContainer, options);
		quillRef.current = quill;
		quillRef.current.focus();

		if (innerRef) {
			innerRef.current = quill;
		}

		quill.setContents(defaultValueRef.current);
		setText(quill.getText());

		quill.on(Quill.events.TEXT_CHANGE, () => {
			setText(quill.getText());
		});

		return () => {
			quill.off(Quill.events.TEXT_CHANGE);
			if (container) {
				container.innerHTML = '';
			}
			if (quillRef) {
				quillRef.current = null;
			}
			if (innerRef) {
				innerRef.current = null;
			}
		};
	}, [innerRef]);

	const toggleToolbar = () => {
		setIsToolbarVisible(current => !current);
		const toolbarElement = containerRef.current?.querySelector('.ql-toolbar');

		if (toolbarElement) {
			toolbarElement.classList.toggle('hidden');
		}
	};

	const onEmojiSelect = (emoji: any) => {
		const quill = quillRef.current;

		quill?.insertText(quill?.getSelection()?.index || 0, emoji.native);
	};

	const isEmpty = !image && text.replace(/<(.|\n)*?>/g, '').trim().length === 0;

	return (
		<div className="flex flex-col">
			<input
				type="file"
				accept="image/*"
				ref={imageElementRef}
				onChange={e => setImage(e.target.files![0])}
				className="hidden"
			/>
			<div
				className={cn(
					'flex flex-col border border-slate-200 dark:border-slate-800 rounded-md overflow-hidden focus-within:border-slate-300 dark:focus-within:border-slate-700 focus-within:shadow-sm transition bg-card',
					disabled && 'opacity-50',
				)}
			>
				<div ref={containerRef} className="h-full ql-custom transition-all" />
				{!!image && (
					<div className="p-2">
						<div className="relative size-[62px] flex items-center justify-center group/image">
							<Hint label={t('message.image_remove')}>
								<button
									onClick={() => {
										setImage(null);
										imageElementRef.current!.value = '';
									}}
									className="hidden group-hover/image:flex rounded-full bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white size-6 z-[4] border-2 border-white items-center justify-center"
								>
									<XIcon className="size-3.5" />
								</button>
							</Hint>
							<Image
								src={URL.createObjectURL(image)}
								alt="Uploaded"
								fill
								className="rounded-lg overflow-hidden border object-cover"
							/>
						</div>
					</div>
				)}
				<div className="flex px-2 pb-2 z-[5]">
					<TooltipButton
						hint={t(
							isToolbarVisible ? 'message.format_hide' : 'message.format_show',
						)}
						icon={PiTextAa}
						disabled={disabled}
						onClick={toggleToolbar}
					/>
					<EmojiPopover hint={t('message.emoji')} onEmojiSelect={onEmojiSelect}>
						<Button size="iconSm" variant="ghost" disabled={disabled}>
							<SmileIcon />
						</Button>
					</EmojiPopover>
					{variant === 'create' && (
						<TooltipButton
							hint={t('message.image')}
							icon={ImageIcon}
							disabled={disabled}
							onClick={() => imageElementRef.current?.click()}
						/>
					)}
					<div className="ml-auto flex items-center gap-x-2">
						{variant === 'update' && (
							<Button
								variant="outline"
								disabled={disabled}
								size="sm"
								onClick={onCancel}
							>
								{t('actions.cancel')}
							</Button>
						)}
						<Button
							disabled={disabled || isEmpty}
							size={variant === 'update' ? 'sm' : 'iconSm'}
							onClick={() =>
								onSubmit({
									body: JSON.stringify(quillRef.current?.getContents()),
									image,
								})
							}
							className="bg-green-700 hover:bg-green-700/80 text-white"
						>
							{variant === 'update' ? t('actions.save') : <MdSend />}
						</Button>
					</div>
				</div>
			</div>
			{variant === 'create' && (
				<div
					className={cn(
						'p-2 text-[10px] text-muted-foreground flex justify-end opacity-0',
						!isEmpty && 'opacity-100',
					)}
				>
					<p>
						<strong>Shift + Return</strong>
						{t('message.new_line')}
					</p>
				</div>
			)}
		</div>
	);
};

export default Editor;
