const typeDefs = /*GraphQL */ `
	type Query {
		tag(name: String!): Tag!
	}

	type Tag {
		name: String!
		description: String
		resources: [Resource!]!
	}

	type Resource {
		name: String!
		description: String
		URL: String!
		tags: [Tag!]!
	}
`;

export default typeDefs;