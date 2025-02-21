'use client';

import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { useMediaQuery } from 'usehooks-ts';

import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { usePanel } from '@/hooks/use-panel';

interface MobileMenuProps {
	open: boolean;
	children: React.ReactNode;
}

export const MobileMenu = ({ children, open }: MobileMenuProps) => {
	const isDesktop = useMediaQuery('(min-width: 1024px)');
	const { onClose } = usePanel();

	return (
		<Sheet open={open && !isDesktop} onOpenChange={onClose}>
			<SheetContent
				aria-describedby={undefined}
				side="right"
				className="p-0 w-full sm:w-96"
				hideClose
			>
				<VisuallyHidden.Root asChild>
					<SheetTitle className="hidden" />
				</VisuallyHidden.Root>
				{children}
			</SheetContent>
		</Sheet>
	);
};
