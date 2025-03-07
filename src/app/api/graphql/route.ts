// Next.js Custom Route Handler: https://nextjs.org/docs/app/building-your-application/routing/router-handlers
import { createSchema, createYoga } from 'graphql-yoga';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Resource, Tag } from '@/lib/types/resources';
import MongoDbUtils from '@/lib/database/MongoDBUtils';
import { Db } from 'mongodb';
import createChildLogger from '@/lib/logger/logger';

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
		typeDefs: fs.readFileSync(
			path.join(path.dirname(fileURLToPath(import.meta.url)),
				'@/lib/graphql/schema.graphql'),
			'utf-8'),
		resolvers: {
			Query: {

				tag: async (_, { name }): Promise<Tag> => {
					const searchySearch = {name: name};
					const tag = await tagsColl.findOne(searchySearch);

					if (!tag) {
						throw new Error('Tag not found');
					}

					return {
						_id: tag._id,
						name: tag.name,
						description: tag.description,
						resources: tag.resources
					};
				},

				resource: async (_, { name }): Promise<Resource> => {
					const searchySearch = {name: name};
					const resource = await resourcesColl.findOne(searchySearch);

					if (!resource) {
						throw new Error('Resource not found');
					}

					return {
						_id: resource._id,
						name: resource.name,
						description: resource.description,
						URL: resource.URL,
						tags: resource.tags
					};
				}
			},
			/*
			Tag: {
				name: (parent: Tag, args, context, info) => parent.name,
				description: (parent: Tag, args, context, info) => parent.description,
				resources: async (parent: Tag, args, context, info): Promise<Resource[]> => parent.resources
			},

			Resource: {
				name: (parent: Resource, args, context, info) => parent.name,
				description: (parent: Resource, args, context, info) => parent.description,
				URL: (parent: Resource, args, context, info) => parent.URL,
				tags: async (parent: Resource, args, context, info): Promise<Tag[]> => {
					const tagIds = parent.tags.map(tag => tag._id);
					const queryTags = await tagsColl.find({ _id: { $in: tagIds } }).toArray();
					return queryTags.map(tag => ({
						_id: tag._id,
						name: tag.name,
						description: tag.description,
						resources: tag.resources
					}));
				}
			}
			*/	
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