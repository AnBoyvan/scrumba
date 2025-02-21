import { format, isToday, isYesterday } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { enUS, uk } from 'date-fns/locale';
import { useLocale, useTranslations } from 'next-intl';

import { Locale } from '@/i18n/config';

const locales = {
	en: enUS,
	uk: uk,
};

export const useDateFormatter = () => {
	const t = useTranslations();
	const locale = useLocale() as Locale;

	const currentLocale = locales[locale];

	const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	const formatDate = (date: string | number) => {
		const zonedDate = toZonedTime(new Date(date), userTimeZone);

		return format(
			toZonedTime(zonedDate, userTimeZone),
			locale === 'uk' ? 'd MMMM yyyy року' : 'MMMM d, yyy',
			{
				locale: currentLocale,
			},
		);
	};

	const formatDateKey = (date: Date, variant: string = 'dd-MM-yyyy') => {
		return format(toZonedTime(date, userTimeZone), variant, {
			locale: currentLocale,
		});
	};

	const formatDateLabel = (date: string | number) => {
		const zonedDate = toZonedTime(new Date(date), userTimeZone);

		if (isToday(zonedDate)) {
			return t('common.today');
		}

		if (isYesterday(zonedDate)) {
			return t('common.yesterday');
		}

		return format(
			toZonedTime(zonedDate, userTimeZone),
			locale === 'uk' ? 'EEEE, d MMMM' : 'EEEE, MMMM d',
			{ locale: currentLocale },
		);
	};

	const formatFullTime = (date: Date) => {
		const zonedDate = toZonedTime(date, userTimeZone);

		const time = format(
			toZonedTime(zonedDate, userTimeZone),
			locale === 'uk' ? 'HH:mm:ss' : 'h:mm:ss a',
			{ locale: currentLocale },
		);

		if (isToday(zonedDate)) {
			return `${t('common.today')}${t('common.at_time')}${time}`;
		}

		if (isYesterday(zonedDate)) {
			return `${t('common.yesterday')}${t('common.at_time')}${time}`;
		}

		const day = format(
			toZonedTime(zonedDate, userTimeZone),
			locale === 'uk' ? 'd MMM yyyy' : 'MMM d, yyyy',
			{ locale: currentLocale },
		);

		return `${day}${t('common.at_time')}${time}`;
	};

	const formatTime = (date: Date) => {
		const zonedDate = toZonedTime(date, userTimeZone);

		return format(
			toZonedTime(zonedDate, userTimeZone),
			locale === 'uk' ? 'HH:mm' : 'h:mm a',
			{
				locale: currentLocale,
			},
		);
	};

	return {
		formatDate,
		formatDateKey,
		formatDateLabel,
		formatFullTime,
		formatTime,
	};
};
