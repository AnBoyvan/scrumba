import { JSX, useState } from 'react';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

export const useConfirm = (
	title: string,
	message: string,
): [() => JSX.Element, () => Promise<unknown>] => {
	const t = useTranslations();

	const [promise, setPromise] = useState<{
		resolve: (value: boolean) => void;
	} | null>(null);

	const confirm = () =>
		new Promise((resolve, _reject) => {
			setPromise({ resolve });
		});

	const handleClose = () => setPromise(null);

	const handleCancel = () => {
		promise?.resolve(false);
		setPromise(null);
	};

	const handleConfirm = () => {
		promise?.resolve(true);
		setPromise(null);
	};

	const ConfirmDialog = () => (
		<Dialog open={promise !== null} onOpenChange={handleClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{message}</DialogDescription>
				</DialogHeader>
				<DialogFooter className="pt-2 gap-y-2">
					<Button variant="outline" onClick={handleCancel}>
						{t('actions.cancel')}
					</Button>
					<Button onClick={handleConfirm}>{t('actions.confirm')}</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);

	return [ConfirmDialog, confirm];
};
