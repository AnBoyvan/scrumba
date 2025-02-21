import { LucideIcon } from 'lucide-react';
import { IconType } from 'react-icons/lib';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarButtonProps {
	icon: LucideIcon | IconType;
	label: string;
	isActive?: boolean;
	onClick?: () => void;
}

export const SidebarButton = ({
	icon: Icon,
	label,
	isActive,
	onClick,
}: SidebarButtonProps) => {
	return (
		<div className="flex flex-col items-center justify-center gap-y-0.5 cursor-pointer group">
			<Button
				variant="transparent"
				onClick={() => onClick?.()}
				className={cn(
					'size-9 p-2  group-hover:bg-blue-700 text-slate-200 [&_svg]:size-5',
					isActive && 'bg-blue-700',
				)}
			>
				<Icon className="group-hover:scale-110 transition-all" />
			</Button>
			<span className="text-[10px] text-slate-200">{label}</span>
		</div>
	);
};
