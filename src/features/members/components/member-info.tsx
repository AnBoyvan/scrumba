import Link from 'next/link';

import { MailIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface MemberInfoProps {
	email?: string;
}

export const MemberInfo = ({ email }: MemberInfoProps) => {
	const t = useTranslations();

	return (
		<div className="flex flex-col p-4">
			<p className="text-sm font-bold mb-4">{t('user.contact_info')}</p>
			<div className="flex items-center gap-2">
				<div className="size-9 rounded-md bg-muted flex items-center justify-center shrink-0">
					<MailIcon className="size-4" />
				</div>
				<div className="flex flex-col overflow-hidden">
					<p className="text-[13px] font-semibold text-muted-foreground">
						{t('common.email')}
					</p>
					<Link
						href={`mailto:${email}`}
						className="text-sm hover:underline text-link truncate"
					>
						{email}
					</Link>
				</div>
			</div>
		</div>
	);
};
