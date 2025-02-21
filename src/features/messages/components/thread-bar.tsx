import { formatDistanceToNow } from 'date-fns';
import { ChevronRightIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { UserAvatar } from '@/components/common/user-avatar';
import { Locale, langs } from '@/i18n/config';

interface ThreadBarProps {
	count?: number;
	image?: string;
	name?: string;
	timestamp?: number;
	onClick?: () => void;
}

export const ThreadBar = ({
	count,
	image,
	name,
	timestamp,
	onClick,
}: ThreadBarProps) => {
	const t = useTranslations();
	const locale = useLocale();

	if (!count || !timestamp) return null;

	return (
		<button
			onClick={onClick}
			className="p-1 rounded-md hover:bg-card border border-transparent hover:border-border flex items-center justify-start group/thread-bar transition max-w-md gap-x-2"
		>
			<div className="flex items-center gap-2 overflow-hidden">
				<UserAvatar
					size="sm"
					name={name}
					image={image}
					className="size-6 shrink-0"
				/>
				<span className="text-xs text-link hover:underline font-bold truncate">
					{t('message.reply_plural')}: {count}
				</span>
				<span className="text-xs text-muted-foreground truncate group-hover/thread-bar:hidden block">
					{t('message.reply_last')}
					{formatDistanceToNow(timestamp, {
						addSuffix: true,
						locale: langs[locale as Locale],
					})}
				</span>
				<span className="text-xs text-muted-foreground truncate group-hover/thread-bar:block hidden">
					{t('message.thread_view')}
				</span>
			</div>
			<ChevronRightIcon className="size-4 text-muted-foreground ml-auto opacity-0 group-hover/thread-bar:opacity-100 transition shrink-0" />
		</button>
	);
};
