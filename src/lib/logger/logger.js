/* eslint-disable no-console */
import pino from 'pino';
// Force Nextjs to keep these modules around!
// import 'pino-pretty';

const options = {
	transport: {
		target: 'pino-pretty',
		options: {
			level: 'trace'
		}
	},
	browser: {
		serialize: true,
		write: {
			trace: (obj) => {
				console.trace(JSON.stringify(obj));
			},
			debug: (obj) => {
				console.debug(JSON.stringify(obj));
			},
			info: (obj) => {
				console.info(JSON.stringify(obj));
			},
			warn: (obj) => {
				console.warn(JSON.stringify(obj));
			},
			error: (err, obj) => {
				console.error(JSON.stringify(err, obj));
			},
			fatal: (obj) => {
				console.error(JSON.stringify(obj));
			}
		}
	},
	formatters: {
		level: label => {
			return {
				level: label.toUpperCase()
			};
		}
	}
};

function initializeLogger(options) {
	try { 
		return pino(options);
	} catch(error) {
		console.log(error, 'Error initializing logger');
	}
}

const Log = initializeLogger(options);

export default function createChildLogger(service, meta) {
	return Log.child({
		service: service,
		transaction: meta
	});
}