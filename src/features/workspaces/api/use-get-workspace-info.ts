import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

interface UseGetWorkspaceInfoProps {
	workspaceId: Id<'workspaces'>;
}

export const useGetWorkspaceInfo = ({
	workspaceId,
}: UseGetWorkspaceInfoProps) => {
	const info = useQuery(api.workspaces.getInfoById, { workspaceId });

	const isLoadingInfo = info === undefined;

	return { info, isLoadingInfo };
};
