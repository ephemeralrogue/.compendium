export interface Resource {
	name: string;
	description: string;
	URL: string;
	tags: Tag[];
}

export interface Tag {
	name: string;
	description: string;
	resources: Resource[];
}