'use server';

import { cookies } from 'next/headers';

import {
	LOCALE_COOKIE_NAME,
	Locale,
	defaultLocale,
	locales,
} from '@/i18n/config';

import { getBrowserLocale } from './get-browser-locale';

export async function getUserLocale() {
	const reqCookies = await cookies();

	const currentLocale = reqCookies.get(LOCALE_COOKIE_NAME)?.value;

	if (currentLocale !== undefined) {
		return currentLocale;
	}

	const browserLocale = await getBrowserLocale();

	if (locales.includes(browserLocale as Locale)) {
		return browserLocale;
	}

	return defaultLocale;
}

export async function setUserLocale(locale: Locale) {
	const reqCookies = await cookies();

	reqCookies.set(LOCALE_COOKIE_NAME, locale);
}
