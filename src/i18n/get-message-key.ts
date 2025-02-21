import { messages } from './messages';

export const getMessageKey = (msg: string): TranslationKey | null => {
	const searchKey = (obj: ErrorMessage, prefix = ''): string | null => {
		for (const key in obj) {
			const currentKey = prefix ? `${prefix}.${key}` : key;
			const currentValue = obj[key];

			if (typeof currentValue === 'object' && currentValue !== null) {
				const result = searchKey(currentValue, currentKey);
				if (result) {
					return result;
				}
			} else if (currentValue === msg) {
				return currentKey;
			}
		}
		return null;
	};

	const key = searchKey(messages) as TranslationKey | null;

	return key;
};
