'use client';

import Image from 'next/image';
import { useState } from 'react';

import { APP } from '@/configs/app.config';

import { SignInFlow } from '../types';
import { SignInCard } from './sign-in-card';
import { SignUpCard } from './sign-up-card';

export const AuthScreen = () => {
	const [state, setState] = useState<SignInFlow>('signIn');

	return (
		<div className="h-full flex items-center justify-center bg-blue-900 md:p-4 overflow-y-auto">
			<div className="hidden md:flex flex-col gap-y-4 items-center w-full max-w-[420px] text-slate-900">
				<Image src="/logo-black.png" width={200} height={300} alt={APP.NAME} />
				<p className="text-6xl font-bold uppercase">{APP.NAME}</p>
			</div>
			<div className="md:h-auto w-full md:max-w-[420px] shadow-xl">
				{state === 'signIn' ? (
					<SignInCard setState={setState} />
				) : (
					<SignUpCard setState={setState} />
				)}
			</div>
		</div>
	);
};
