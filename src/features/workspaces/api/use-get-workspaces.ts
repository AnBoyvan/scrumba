import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';

export const useGetWorkspaces = () => {
	const workspaces = useQuery(api.workspaces.get);

	const isLoadingWorkspaces = workspaces === undefined;

	return { workspaces, isLoadingWorkspaces };
};
