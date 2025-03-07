import {
	Db,
	MongoClient,
	MongoClientOptions,
	ServerApiVersion
} from 'mongodb';
import createChildLogger from './logger.js';

const mongoLogger = createChildLogger('MongoDB');

const mongoDBURIPartial: string = `${process.env.MONGODB_PREFIX}://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}/`;

const options: MongoClientOptions = {
	appName: process.env.MONGODB_APP_NAME,
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true
	},
	monitorCommands: true,
	writeConcern: {
		w: 'majority'
	}
};

const MongoDbUtils = {
	state: {
		dbMap: new Map<string, Db>(),
		clientMap: new Map<string, MongoClient>(),
	},

	connect: async (database: string): Promise<Db> => {

		let db: Db | undefined = MongoDbUtils.state.dbMap.get(database);

		if (db == null) {

			mongoLogger.debug(`Connecting to ${database} for first time!`);

			const mongoClient = await MongoClient.connect(mongoDBURIPartial + database, options)
				/*
				.then((client: MongoClient) => {
					mongoLogger.debug(`Connected to ${database}!`);
					return client;
				})
				.catch((error: Error) => {
					mongoLogger.error(`Error connecting to ${database}: ${error.message}`);
				});
				*/
			
			MongoDbUtils.state.clientMap.set(database, mongoClient);
			MongoDbUtils.state.dbMap.set(database, mongoClient.db(database));
			db = mongoClient.db();
		}

		return db;
	}
};

export default MongoDbUtils;