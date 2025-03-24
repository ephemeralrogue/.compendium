// Next.js Custom Route Handler: https://nextjs.org/docs/app/building-your-application/routing/router-handlers
import { createSchema, createYoga } from 'graphql-yoga';
import typeDefs from '@/lib/graphql/typeDefs';
import resolvers from '@/lib/graphql/resolvers';
import createChildLogger from '@/lib/logger/logger';

const graphQLLogger = createChildLogger('GraphQL');

interface NextContext {
	params: Promise<Record<string, string>>
}

graphQLLogger.debug('GraphQL Route Handler Loaded');
graphQLLogger.debug(`Attempting to connect to MongoDB Database: ${process.env.MONGODB_DATABASE}`);

const { handleRequest } = createYoga<NextContext>({
	schema: createSchema({
		typeDefs,
		resolvers,
	}),
 
	// While using Next.js file convention for routing, we need to configure Yoga to use the correct endpoint
	graphqlEndpoint: '/api/graphql',
 
	// Yoga needs to know how to create a valid Next response
	fetchAPI: { Response }
});
 
export {
	handleRequest as GET,
	handleRequest as POST,
	handleRequest as OPTIONS
};