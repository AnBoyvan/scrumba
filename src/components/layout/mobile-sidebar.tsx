'use client';

import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { WorkspaceSidebar } from '@/features/workspaces/components/workspace-sidebar';
import { useMobileSidebar } from '@/hooks/use-mobile-sidebar';

import { Sidebar } from './sidebar';

export const MobileSidebar = () => {
	const [open, setOpen] = useMobileSidebar();

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetContent
				aria-describedby={undefined}
				side="left"
				className="p-0 w-full sm:w-96 flex bg-sky-700 gap-0 border-transparent"
				closeClassName="text-slate-200 [&_svg]:size-5"
			>
				<VisuallyHidden.Root asChild>
					<SheetTitle className="hidden" />
				</VisuallyHidden.Root>
				<Sidebar />
				<div className="h-full flex-1 overflow-hidden">
					<WorkspaceSidebar />
				</div>
			</SheetContent>
		</Sheet>
	);
};
