import { Tag } from '../types/resources';
import MongoDbUtils from '@/lib/database/MongoDBUtils';
import { Db } from 'mongodb';

const db: Db = await MongoDbUtils.connect(`${process.env.MONGODB_DATABASE}`);
// const resourcesColl = db.collection('resources');
const tagsColl = db.collection('tags');

const resolvers = {
	Query: {
		tag: async (_: undefined, { name }: Tag): Promise<Tag> => {
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
		}
	}
};

export default resolvers;