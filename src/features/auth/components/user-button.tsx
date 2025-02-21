'use client';

import Link from 'next/link';

import { useAuthActions } from '@convex-dev/auth/react';
import { LogOutIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

import { Spinner } from '@/components/common/spinner';
import { UserAvatar } from '@/components/common/user-avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMobileSidebar } from '@/hooks/use-mobile-sidebar';
import { Locale } from '@/i18n/config';
import { setUserLocale } from '@/i18n/userLocale';

import { useCurrentUser } from '../api/use-current-user';

export const UserButton = () => {
	const t = useTranslations();
	const locale = useLocale();
	const { signOut } = useAuthActions();
	const { user, isLoadingUser } = useCurrentUser();
	const [_open, setOpen] = useMobileSidebar();
	const { theme, setTheme } = useTheme();

	if (isLoadingUser) {
		return (
			<div className="size-10 flex items-center justify-center">
				<Spinner />
			</div>
		);
	}

	if (!user) {
		return null;
	}

	const { image, name } = user;

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger className="outline-none relative">
				<UserAvatar
					name={name}
					image={image}
					className="hover:opacity-75 transition size-9"
				/>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-60 p-2">
				<div className="flex gap-x-3 pb-2 items-center">
					<UserAvatar name={user.name} image={user.image} />
					<div className="flex flex-col overflow-hidden">
						<p className="text-sm font-semibold">{user.name}</p>
						<p className="text-xs text-muted-foreground truncate">
							{user.email}
						</p>
					</div>
				</div>
				<DropdownMenuItem asChild className="h-10">
					<Link
						href="/profile"
						onClick={() => {
							setOpen(false);
						}}
					>
						{t('common.profile')}
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSub>
					<DropdownMenuSubTrigger className="w-full mb-0 h-10">
						{t('general.theme.label')}
					</DropdownMenuSubTrigger>
					<DropdownMenuSubContent>
						<DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
							<DropdownMenuRadioItem value="light">
								{t('general.theme.light')}
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="dark">
								{t('general.theme.dark')}
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="system">
								{t('general.theme.system')}
							</DropdownMenuRadioItem>
						</DropdownMenuRadioGroup>
					</DropdownMenuSubContent>
				</DropdownMenuSub>
				<DropdownMenuSub>
					<DropdownMenuSubTrigger className="w-full mb-0 h-10">
						{t('general.locale.label')}
					</DropdownMenuSubTrigger>
					<DropdownMenuSubContent>
						<DropdownMenuRadioGroup
							value={locale}
							onValueChange={value => setUserLocale(value as Locale)}
						>
							<DropdownMenuRadioItem value="uk">
								{t('general.locale.uk_full')}
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="en">
								{t('general.locale.en_full')}
							</DropdownMenuRadioItem>
						</DropdownMenuRadioGroup>
					</DropdownMenuSubContent>
				</DropdownMenuSub>
				<DropdownMenuItem
					onClick={() => {
						setOpen(false);
						signOut();
					}}
					className="h-10 text-destructive"
				>
					<LogOutIcon className="size-4 mr-2" />
					{t('auth.logout')}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
