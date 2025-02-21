import { atom, useAtom } from 'jotai';

const modalState = atom(false);

export const useMobileSidebar = () => {
	return useAtom(modalState);
};
