import { XIcon } from 'lucide-react';

import { Button } from '../ui/button';

interface MenuHeaderProps {
	label: string;
	onClose: () => void;
}

export const MenuHeader = ({ label, onClose }: MenuHeaderProps) => {
	return (
		<div className="flex justify-between items-center px-4 border-b bg-card h-[49px] shrink-0">
			<p className="text-lg font-bold">{label}</p>
			<Button
				size="iconSm"
				variant="ghost"
				onClick={onClose}
				className="[&_svg]:size-5"
			>
				<XIcon className="stroke-[1.5]" />
			</Button>
		</div>
	);
};
