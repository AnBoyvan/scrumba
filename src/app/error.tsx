'use client';

import Link from 'next/link';

import { AlertTriangleIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { getMessageKey } from '@/i18n/get-message-key';

export default function ErrorPage({
	error,
}: {
	error: Error & { digest?: string };
}) {
	const t = useTranslations();

	const tKey = getMessageKey(error.message);

	return (
		<div className="h-screen flex flex-col gap-y-4 items-center justify-center">
			<AlertTriangleIcon className="size-6 text-destructive mb-2" />
			<p className="text-sm font-medium text-muted-foreground">
				{!!tKey ? t(tKey) : error.message}
			</p>
			<Button size="sm" asChild>
				<Link href="/">{t('actions.back_home')}</Link>
			</Button>
		</div>
	);
}
