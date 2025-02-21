import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
	size?: 'sm' | 'lg';
	name?: string;
	image?: string;
	className?: string;
	fallbackClassName?: string;
}

export const UserAvatar = ({
	size,
	name = 'User',
	image,
	className,
	fallbackClassName,
}: UserAvatarProps) => {
	const avatarFallback = name.charAt(0).toUpperCase();

	return (
		<Avatar
			className={cn(
				size === 'sm' && 'size-5',
				size === 'lg' && 'size-14',
				className && className,
			)}
		>
			<AvatarImage src={image} alt={name} />
			<AvatarFallback
				className={cn(
					size === 'sm' && 'text-xs',
					size === 'lg' && 'text-2xl',
					fallbackClassName && fallbackClassName,
				)}
			>
				{avatarFallback}
			</AvatarFallback>
		</Avatar>
	);
};
