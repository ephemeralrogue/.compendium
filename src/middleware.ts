import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createChildLogger from './lib/logger';

const routesLogger = createChildLogger('routes', {
	transaction: 'api'
});
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
	switch (request.nextUrl.pathname) {
		case '/api/graphql':
			routesLogger.info('GraphQL request received');
			return NextResponse.next();
		default:
		// routesLogger.info('Request received');
			return NextResponse.next();
	}
};