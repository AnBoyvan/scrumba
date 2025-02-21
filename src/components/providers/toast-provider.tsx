'use client';

import { useTheme } from 'next-themes';
import { Toaster, ToasterProps } from 'sonner';

export function ToastProvider() {
	const { theme } = useTheme();

	return (
		<>
			<Toaster theme={theme as ToasterProps['theme']} richColors />
		</>
	);
}
