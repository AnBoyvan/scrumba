import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

interface UseGetMemberProps {
	memberId: Id<'members'>;
}

export const useGetMember = ({ memberId }: UseGetMemberProps) => {
	const member = useQuery(api.members.getById, { memberId });

	const isLoadingMember = member === undefined;

	return { member, isLoadingMember };
};
