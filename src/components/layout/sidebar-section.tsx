import { PlusIcon } from 'lucide-react';
import { FaCaretDown } from 'react-icons/fa';
import { useToggle } from 'react-use';

import { Hint } from '@/components/common/hint';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarSectionProps {
	children: React.ReactNode;
	label: string;
	hint?: string;
	onNew?: () => void;
}

export const SidebarSection = ({
	children,
	label,
	hint,
	onNew,
}: SidebarSectionProps) => {
	const [on, toggle] = useToggle(true);

	return (
		<div className="flex flex-col px-2 mt-3">
			<div className="flex items-center px-3.5 h-7 overflow-hidden group">
				<Button
					variant="transparent"
					className="text-slate-300 p-0.5 size-6 shrink-0 mr-2"
					onClick={toggle}
				>
					<FaCaretDown
						className={cn('transition-transform', on && '-rotate-90')}
					/>
				</Button>
				<span className="text-sm truncate text-slate-300">{label}</span>
				{onNew && hint && (
					<Hint label={hint} side="top" align="center">
						<Button
							variant="transparent"
							className="md:opacity-0 group-hover:opacity-100 transition-opacity ml-auto p-0.5 shrink-0 size-6 text-slate-300 [&_svg]:size-5"
							onClick={onNew}
						>
							<PlusIcon />
						</Button>
					</Hint>
				)}
			</div>
			{on && children}
		</div>
	);
};
