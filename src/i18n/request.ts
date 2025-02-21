import { getRequestConfig } from 'next-intl/server';

import { getUserLocale } from './userLocale';

export default getRequestConfig(async () => {
	const locale = await getUserLocale();

	return {
		locale,
		messages: {
			...(await import(`../../messages/${locale}/actions.json`)).default,
			...(await import(`../../messages/${locale}/auth.json`)).default,
			...(await import(`../../messages/${locale}/channel.json`)).default,
			...(await import(`../../messages/${locale}/common.json`)).default,
			...(await import(`../../messages/${locale}/conversation.json`)).default,
			...(await import(`../../messages/${locale}/general.json`)).default,
			...(await import(`../../messages/${locale}/message.json`)).default,
			...(await import(`../../messages/${locale}/user.json`)).default,
			...(await import(`../../messages/${locale}/validation.json`)).default,
			...(await import(`../../messages/${locale}/workspace.json`)).default,
		},
	};
});
