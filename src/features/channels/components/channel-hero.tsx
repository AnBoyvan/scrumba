import { useLocale, useTranslations } from 'next-intl';

import { useDateFormatter } from '@/hooks/use-date-formatter';

interface ChannelHeroProps {
	name: string;
	creationTime: number;
}

export const ChannelHero = ({ name, creationTime }: ChannelHeroProps) => {
	const t = useTranslations();
	const locale = useLocale();
	const { formatDate } = useDateFormatter();

	return (
		<div className="mt-[88px] mx-5 mb-4">
			<p className="text-2xl font-bold flex items-center mb-2"># {name}</p>
			<p className="font-normal text-slate-800 dark:text-slate-300">
				{t('channel.hero_created')}
				{formatDate(creationTime)}.{t('channel.hero_beginning')}
				{locale === 'uk' && t('channel.hero_channel')}
				<strong>{name}</strong>
				{locale === 'en' && t('channel.hero_channel')}.
			</p>
		</div>
	);
};
