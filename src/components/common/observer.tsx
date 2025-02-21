interface ObserverProps {
	onIntersect: () => void;
	condition?: boolean;
}

export const Observer = ({ onIntersect, condition }: ObserverProps) => {
	return (
		<div
			className="h-1"
			ref={el => {
				if (el) {
					const observer = new IntersectionObserver(
						([entry]) => {
							if (entry.isIntersecting && condition) {
								onIntersect();
							}
						},
						{ threshold: 1.0 },
					);

					observer.observe(el);
					return () => observer.disconnect();
				}
			}}
		/>
	);
};
