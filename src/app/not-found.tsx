'use client';

import Link from 'next/link';

import { FrownIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

export default function ErrorPage() {
	const t = useTranslations();

	return (
		<div className="h-screen flex flex-col gap-y-4 items-center justify-center">
			<FrownIcon className="size-40 text-muted-foreground" />
			<p className="text-4xl font-bold text-muted-foreground">404</p>
			<p className="text-base font-medium text-muted-foreground">
				{t('general.page_not_found')}
			</p>
			<Button size="sm" asChild>
				<Link href="/">{t('actions.back_home')}</Link>
			</Button>
		</div>
	);
}
