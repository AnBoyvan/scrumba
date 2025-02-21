import { TriangleAlertIcon } from 'lucide-react';

interface NotFoundProps {
	message: string;
}

export const NotFound = ({ message }: NotFoundProps) => {
	return (
		<div className="h-full w-full flex items-center justify-center flex-col gap-2">
			<TriangleAlertIcon className="size-6 shrink-0 text-muted-foreground" />
			<span className="text-sm text-muted-foreground">{message}</span>
		</div>
	);
};
