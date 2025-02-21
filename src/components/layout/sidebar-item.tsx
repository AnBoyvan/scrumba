import Link from 'next/link';

import { type VariantProps, cva } from 'class-variance-authority';
import { LucideIcon } from 'lucide-react';
import { IconType } from 'react-icons/lib';

import { Button } from '@/components/ui/button';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useMobileSidebar } from '@/hooks/use-mobile-sidebar';
import { cn } from '@/lib/utils';

const sidebarItemVariants = cva(
	'flex items-center gap-1.5 justify-start font-normal h-7 px-[18px] text-sm overflow-hidden [&_svg]:size-3.5',
	{
		variants: {
			variant: {
				default: 'text-slate-300',
				active: 'text-blue-700 bg-white/90 hover:bg-white/90',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
);

interface SidebarItemProps {
	label: string;
	id: string;
	icon: LucideIcon | IconType;
	variant?: VariantProps<typeof sidebarItemVariants>['variant'];
}

export const SidebarItem = ({
	label,
	id,
	icon: Icon,
	variant,
}: SidebarItemProps) => {
	const workspaceId = useWorkspaceId();
	const [_open, setOpen] = useMobileSidebar();

	return (
		<Button
			asChild
			size="sm"
			variant="transparent"
			className={cn(sidebarItemVariants({ variant }))}
			onClick={() => setOpen(false)}
		>
			<Link href={`/workspace/${workspaceId}/channel/${id}`}>
				<Icon className="shrink-0" />
				<span className="truncate">{label}</span>
			</Link>
		</Button>
	);
};
