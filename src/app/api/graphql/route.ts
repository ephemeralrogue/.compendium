// Next.js Custom Route Handler: https://nextjs.org/docs/app/building-your-application/routing/router-handlers
import { createSchema, createYoga } from 'graphql-yoga';
import { Resource, Tag } from '../../../lib/types/resources';
// import schema from '../../schemas/schema.js';

interface NextContext {
	params: Promise<Record<string, string>>
}

 
const { handleRequest } = createYoga<NextContext>({
	schema: createSchema({
		typeDefs: /* GraphQL */ `
			type Query {
				resource: Resource,
				tags: Tag[],
			}

			type Tag {
				name: String,
				description: String,
				resources: Resource[]
			}

			type Resource {
				name: String,
				description: String,
				URL: String,
				tags: Tag[]
			}
		`,
		resolvers: {
			Query: {
				getResourcesByTag: (parent, args: { tag: string }, context, info): Resource[] => {
					// mongoDB logic here
					return [
						{
							name: 'Resource Name',
							description: 'Resource Description',
							URL: 'Resource URL',
							tags: []
						}
					];
				},
				getTags: (parent, args, context, info): Tag[] => {
					// mongoDB logic here
					return [
						{
							name: 'Tag Name',
							description: 'Tag Description',
							resources: []
						}
					];
				},
			}
		}
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