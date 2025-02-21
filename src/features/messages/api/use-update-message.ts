import { useCallback, useMemo, useState } from 'react';

import { useMutation } from 'convex/react';
import { ConvexError } from 'convex/values';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { getMessageKey } from '@/i18n/get-message-key';

type RequestType = {
	messageId: Id<'messages'>;
	body: string;
};

type ResponseType = Id<'messages'> | null;

type Options = {
	onSuccess?: (data: ResponseType) => void;
	onError?: (message: string) => void;
	onSettled?: () => void;
	throwError?: boolean;
	hideToast?: boolean;
};

export const useUpdateMessage = () => {
	const t = useTranslations();

	const [data, setData] = useState<ResponseType>(null);
	const [error, setError] = useState<Error | null>(null);
	const [status, setStatus] = useState<
		'success' | 'error' | 'settled' | 'pending' | null
	>(null);

	const isPending = useMemo(() => status === 'pending', [status]);
	const isSuccess = useMemo(() => status === 'success', [status]);
	const isError = useMemo(() => status === 'error', [status]);
	const isSettled = useMemo(() => status === 'settled', [status]);

	const mutation = useMutation(api.messages.update);

	const mutate = useCallback(
		async (values: RequestType, options?: Options) => {
			try {
				setData(null);
				setError(null);
				setStatus('pending');

				const respose = await mutation({
					...values,
				});
				options?.onSuccess?.(respose);
				return respose;
			} catch (err) {
				let errorMessage = 'Something went wrong';

				if (err instanceof ConvexError) {
					errorMessage = err.data as string;
				} else if (err instanceof Error) {
					errorMessage = err.message;
				}

				setStatus('error');
				setError(new Error(errorMessage));
				options?.onError?.(errorMessage);

				if (!options?.hideToast) {
					const key = errorMessage && getMessageKey(errorMessage);
					toast.error(key ? t(key) : errorMessage);
				}

				if (options?.throwError) {
					throw error;
				}
			} finally {
				setStatus('settled');
				options?.onSettled?.();
			}
		},
		[mutation],
	);

	return {
		mutate,
		data,
		error,
		status,
		isPending,
		isSuccess,
		isError,
		isSettled,
	};
};
