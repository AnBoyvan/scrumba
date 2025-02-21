import { LucideIcon } from 'lucide-react';
import { IconType } from 'react-icons/lib';

import { Hint } from '@/components/common/hint';
import { Button } from '@/components/ui/button';

interface TooltipButtonProps {
	hint: string;
	icon: LucideIcon | IconType;
	onClick: () => void;
	disabled?: boolean;
}

export const TooltipButton = ({
	hint,
	icon: Icon,
	onClick,
	disabled,
}: TooltipButtonProps) => {
	return (
		<Hint label={hint}>
			<Button
				size="iconSm"
				variant="ghost"
				disabled={disabled}
				onClick={onClick}
			>
				<Icon />
			</Button>
		</Hint>
	);
};
