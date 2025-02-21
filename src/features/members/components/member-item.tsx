import Link from 'next/link';

import { type VariantProps, cva } from 'class-variance-authority';

import { UserAvatar } from '@/components/common/user-avatar';
import { Button } from '@/components/ui/button';
import { Id } from '@/convex/_generated/dataModel';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useMobileSidebar } from '@/hooks/use-mobile-sidebar';
import { cn } from '@/lib/utils';

const memberItemVariants = cva(
	'flex items-center gap-1.5 justify-start font-normal h-7 px-4 text-sm overflow-hidden',
	{
		variants: {
			variant: {
				default: 'text-slate-300',
				active: 'text-blue-700 bg-white/90 hover:bg-white/90',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
);

interface MemberItemProps {
	id: Id<'members'>;
	label?: string;
	image?: string;
	variant?: VariantProps<typeof memberItemVariants>['variant'];
}

export const MemberItem = ({ id, label, image, variant }: MemberItemProps) => {
	const workspaceId = useWorkspaceId();
	const [_open, setOpen] = useMobileSidebar();
	return (
		<Button
			asChild
			size="sm"
			variant="transparent"
			className={cn(memberItemVariants({ variant }))}
			onClick={() => setOpen(false)}
		>
			<Link href={`/workspace/${workspaceId}/member/${id}`}>
				<UserAvatar size="sm" name={label} image={image} />
				<span className="truncate">{label}</span>
			</Link>
		</Button>
	);
};
