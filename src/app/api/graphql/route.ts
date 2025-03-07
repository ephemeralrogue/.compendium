// Next.js Custom Route Handler: https://nextjs.org/docs/app/building-your-application/routing/router-handlers
import { createSchema, createYoga } from 'graphql-yoga';
import { Resource, Tag } from '@/lib/types/resources';
import MongoDbUtils from '@/lib/MongoDBUtils';
import { Db } from 'mongodb';
// import schema from '../../schemas/schema.js';
import createChildLogger from '@/lib/logger';

const graphQLLogger = createChildLogger('GraphQL');

interface NextContext {
	params: Promise<Record<string, string>>
}

graphQLLogger.debug('GraphQL Route Handler Loaded');
graphQLLogger.debug(`Attempting to connect to MongoDB Database: ${process.env.MONGODB_DATABASE}`);

const db: Db = await MongoDbUtils.connect(`${process.env.MONGODB_DATABASE}`);
const resourcesColl = db.collection('resources');
const tagsColl = db.collection('tags');

const { handleRequest } = createYoga<NextContext>({
	schema: createSchema({
		typeDefs: /* GraphQL */ `
			type Query {
				getResourcesByTag(tag: String!): [Resource!]!,
				getTags: [Tag!]!
			}

			type Tag {
				name: String!,
				description: String,
				resources: [Resource!]!
			}

			type Resource {
				name: String!,
				description: String,
				URL: String!,
				tags: [Tag!]!
			}
		`,
		resolvers: {
			Query: {

				getResourcesByTag: async (parent, args: { tag: string }, context, info): Promise<Tag> => {
					const { tag } = args;
					const searchySearch = { name: tag };
					const Tag = await tagsColl.findOne(searchySearch);

					return Tag.resources;
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