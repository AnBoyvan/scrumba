import { useTranslations } from 'next-intl';

import { UserAvatar } from '@/components/common/user-avatar';

interface ConversationHeroProps {
	name?: string;
	image?: string;
}

export const ConversationHero = ({
	name = 'User',
	image,
}: ConversationHeroProps) => {
	const t = useTranslations();

	return (
		<div className="mt-[88px] mx-5 mb-4">
			<div className="flex items-center gap-x-3 mb-2">
				<UserAvatar size="lg" name={name} image={image} />
				<p className="text-2xl font-bold">{name}</p>
			</div>
			<p className="font-normal text-slate-800 dark:text-slate-300">
				{t('conversation.hero')}
				<strong>{name}</strong>
			</p>
		</div>
	);
};
