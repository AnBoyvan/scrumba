interface MessagesSeparatorProps {
	content: React.ReactNode;
}
export const MessagesSeparator = ({ content }: MessagesSeparatorProps) => {
	return (
		<div className="text-center my-2 relative">
			<hr className="absolute top-1/2 left-0 right-0 border-t" />
			<span className="relative inline-block bg-card px-4 py-1 rounded-full text-xs border shadow-sm">
				{content}
			</span>
		</div>
	);
};
