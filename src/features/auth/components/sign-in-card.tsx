'use client';

import { useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';

import { useAuthActions } from '@convex-dev/auth/react';
import { TriangleAlertIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

import { SignInFlow } from '../types';

interface SignInCardProps {
	setState: (state: SignInFlow) => void;
}

export const SignInCard = ({ setState }: SignInCardProps) => {
	const t = useTranslations();
	const { signIn } = useAuthActions();
	const callbackUrl = useSearchParams().get('callbackUrl');

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [pending, setPending] = useState(false);

	const onPasswordSignIn = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setPending(true);
		signIn('password', {
			email,
			password,
			flow: 'signIn',
			redirectTo: callbackUrl || '/',
		})
			.catch(() => {
				setError(t('auth.incorrect_credentials'));
			})
			.finally(() => setPending(false));
	};

	const onProviderSignIn = (value: 'github' | 'google') => {
		setPending(true);
		signIn(value, { redirectTo: callbackUrl || '/' }).finally(() =>
			setPending(false),
		);
	};

	return (
		<Card className="w-full h-full p-8">
			<CardHeader className="px-0 pt-0">
				<CardTitle className="text-xl">{t('auth.sign_in_title')}</CardTitle>
				<CardDescription>{t('auth.sign_in_descr')}</CardDescription>
			</CardHeader>
			{!!error && (
				<div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
					<TriangleAlertIcon className="size-4" />
					<p>{error}</p>
				</div>
			)}
			<CardContent className="space-y-5 px-0 pb-0">
				<form onSubmit={onPasswordSignIn} className="space-y-2.5">
					<Input
						disabled={pending}
						value={email}
						onChange={e => setEmail(e.target.value)}
						type="email"
						placeholder={t('common.email')}
						required
					/>
					<Input
						disabled={pending}
						value={password}
						onChange={e => setPassword(e.target.value)}
						type="password"
						placeholder={t('common.password')}
						required
					/>
					<Button type="submit" size="lg" disabled={pending} className="w-full">
						{t('actions.continue')}
					</Button>
				</form>
				<Separator />
				<div className="flex flex-col gap-y-2.5">
					<Button
						size="lg"
						variant="outline"
						disabled={pending}
						onClick={() => onProviderSignIn('google')}
						className="w-full relative [&_svg]:size-6"
					>
						<FcGoogle />
						{t('auth.google')}
					</Button>
					<Button
						size="lg"
						variant="outline"
						disabled={pending}
						onClick={() => onProviderSignIn('github')}
						className="w-full relative [&_svg]:size-6"
					>
						<FaGithub />
						{t('auth.github')}
					</Button>
				</div>
				<p className="text-sm text-muted-foreground">
					{t('auth.dont_have_account')}
					<span
						onClick={() => setState('signUp')}
						className="text-link hover:underline cursor-pointer"
					>
						{t('auth.sign_up')}
					</span>
				</p>
			</CardContent>
		</Card>
	);
};
