import { defineConfig } from '@eddeee888/gcg-typescript-resolver-files';
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
	overwrite: true,
	schema: 'src/lib/graphql/schema.graphql',
	generates: {
		'src/lib/graphql': defineConfig({
			resolverGeneration: 'minimal'
		}),
		'./graphql.schema.json': {
			plugins: ['introspection']
		}
	}
};

export default config;
