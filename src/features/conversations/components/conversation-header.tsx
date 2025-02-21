import { FaChevronDown } from 'react-icons/fa';

import { UserAvatar } from '@/components/common/user-avatar';
import { Button } from '@/components/ui/button';

interface ConversationHeaderProps {
	memberName?: string;
	memberImage?: string;
	onClick?: () => void;
}

export const ConversationHeader = ({
	memberName = 'User',
	memberImage,
	onClick,
}: ConversationHeaderProps) => {
	return (
		<div className="bg-card border-b h-[49px] flex items-center px-4 overflow-hidden">
			<Button
				size="sm"
				variant="ghost"
				onClick={onClick}
				className="text-lg font-semibold px-2 overflow-hidden w-auto [&_svg]:size-2.5"
			>
				<UserAvatar size="sm" name={memberName} image={memberImage} />
				<span className="truncate">{memberName}</span>
				<FaChevronDown />
			</Button>
		</div>
	);
};
