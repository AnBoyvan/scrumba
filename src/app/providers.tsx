'use client';

import type { PropsWithChildren } from 'react';

import { ThemeProvider } from 'next-themes';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { ConvexClientProvider } from '@/components/providers/convex-client-provider';
import { JotaiProvider } from '@/components/providers/jotai-provider';
import { ModalProvider } from '@/components/providers/modal-provider';
import { ToastProvider } from '@/components/providers/toast-provider';

export function Providers({ children }: PropsWithChildren) {
	return (
		<ThemeProvider
			attribute="class"
			storageKey="theme"
			enableSystem
			disableTransitionOnChange
		>
			<ConvexClientProvider>
				<NuqsAdapter>
					<JotaiProvider>
						<ToastProvider />
						<ModalProvider />
						{children}
					</JotaiProvider>
				</NuqsAdapter>
			</ConvexClientProvider>
		</ThemeProvider>
	);
}
