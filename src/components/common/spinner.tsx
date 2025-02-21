import { LoaderIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

interface SpinnerProps {
	size?: number;
}

export const Spinner = ({ size = 6 }: SpinnerProps) => {
	return (
		<LoaderIcon
			className={cn(
				'animate-spin text-muted-foreground',
				size && `size-${size}`,
			)}
		/>
	);
};
