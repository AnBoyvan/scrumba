import { UserAvatar } from '@/components/common/user-avatar';
import { Doc } from '@/convex/_generated/dataModel';

interface UserTitleProps {
	user: Doc<'users'>;
}

export const UserTitle = ({ user }: UserTitleProps) => {
	return (
		<div className="flex gap-x-3">
			<UserAvatar
				name={user.name}
				image={user.image}
				className="size-14"
				fallbackClassName="text-xl"
			/>
			<div className="flex flex-col overflow-hidden">
				<p className="text-lg font-semibold">{user.name}</p>
				<p className="text-sm text-muted-foreground truncate">{user.email}</p>
			</div>
		</div>
	);
};
