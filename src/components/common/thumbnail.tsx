import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { useTranslations } from 'next-intl';

import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

interface ThumbnailProps {
	url: string | null | undefined;
}

export const Thumbnail = ({ url }: ThumbnailProps) => {
	const t = useTranslations();
	if (!url) return null;

	return (
		<Dialog>
			<DialogTrigger>
				<div className="relative overflow-hidden max-w-[360px] border rounded-lg my-2 cursor-zoom-in">
					<img
						src={url}
						alt={t('message.image')}
						className="rounded-md object-cover size-full"
					/>
				</div>
			</DialogTrigger>
			<DialogContent
				aria-describedby={undefined}
				className="max-h-[90vh] border-none bg-transparent p-0 shadow-none overflow-hidden"
			>
				<VisuallyHidden.Root asChild>
					<DialogTitle className="hidden" />
				</VisuallyHidden.Root>
				<img
					src={url}
					alt={t('message.image')}
					className="rounded-md object-contain size-full max-h-[90vh]"
				/>
			</DialogContent>
		</Dialog>
	);
};
