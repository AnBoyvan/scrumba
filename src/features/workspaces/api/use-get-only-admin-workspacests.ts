import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';

export const useGetOnlyAdminWorkspaces = () => {
	const workspaces = useQuery(api.workspaces.getOnlyAdmin);

	const isLoadingWorkspaces = workspaces === undefined;

	return { workspaces, isLoadingWorkspaces };
};
