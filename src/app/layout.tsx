import type { Metadata } from 'next';
import { Noto_Sans } from 'next/font/google';

import { ConvexAuthNextjsServerProvider } from '@convex-dev/auth/nextjs/server';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

import { APP } from '@/configs/app.config';
import { ENV } from '@/configs/env.config';
import '@/styles/globals.css';

import favicon from '../../public/favicon.ico';
import openGraphImage from '../../public/opengraph-image.png';
import { Providers } from './providers';

const notoSans = Noto_Sans({
	subsets: ['latin', 'cyrillic'],
});

export const metadata: Metadata = {
	metadataBase: new URL(ENV.BASE_URL),
	icons: {
		icon: favicon.src,
	},
	title: {
		default: APP.NAME,
		template: APP.NAME,
	},
	description: APP.DESCRIPTION,
	twitter: {
		card: 'summary_large_image',
	},
	openGraph: {
		title: {
			default: APP.NAME,
			template: APP.NAME,
		},
		images: [
			{
				url: openGraphImage.src,
			},
		],
		description: APP.DESCRIPTION,
		type: 'website',
		url: ENV.BASE_URL,
		siteName: APP.NAME,
	},
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const locale = await getLocale();
	const messages = await getMessages();

	return (
		<ConvexAuthNextjsServerProvider>
			<html
				lang={locale}
				className={notoSans.className}
				suppressHydrationWarning={true}
			>
				<body>
					<NextIntlClientProvider messages={messages}>
						<Providers>{children}</Providers>
					</NextIntlClientProvider>
				</body>
			</html>
		</ConvexAuthNextjsServerProvider>
	);
}
