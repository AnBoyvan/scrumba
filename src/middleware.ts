import { NextResponse } from 'next/server';

import {
	convexAuthNextjsMiddleware,
	createRouteMatcher,
	nextjsMiddlewareRedirect,
} from '@convex-dev/auth/nextjs/server';

const isPublicPage = createRouteMatcher(['/auth']);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
	const isAuthenticated = await convexAuth.isAuthenticated();

	if (!isPublicPage(request) && !isAuthenticated) {
		let callbackUrl = request.nextUrl.pathname;
		if (request.nextUrl.search) {
			callbackUrl += request.nextUrl.search;
		}
		const encodedCallbackUrl = encodeURIComponent(callbackUrl);

		return NextResponse.redirect(
			new URL(`/auth?callbackUrl=${encodedCallbackUrl}`, request.nextUrl),
		);
	}

	if (isPublicPage(request) && isAuthenticated) {
		return nextjsMiddlewareRedirect(request, '/');
	}
});

export const config = {
	matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
