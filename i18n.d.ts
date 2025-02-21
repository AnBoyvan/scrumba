import { messages } from '@/i18n/messages';

type NestedKeyOf<ObjectType extends object> = {
	[Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
		? `${Key}.${NestedKeyOf<ObjectType[Key]>}`
		: `${Key}`;
}[keyof ObjectType];

declare global {
	interface IntlMessages extends Messages {}

	type TranslationKey = NestedKeyOf<IntlMessages>;

	type Messages = typeof messages;

	type ErrorMessage = {
		[key: string]: string | ErrorMessage;
	};

	type TFunction = (
		key: TranslationKey,
		values?: Record<string, any>,
	) => string;
}
