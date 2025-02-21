import { Spinner } from './spinner';

export const PageLoader = () => {
	return (
		<div className="h-full flex-1 flex items-center justify-center">
			<Spinner size={6} />
		</div>
	);
};
