import { WithId, Document, ObjectId } from 'mongodb';

export interface Resource extends WithId<Document> {
	_id: ObjectId
	name: string
	description: string
	URL: string
	tags: Tag[]
}

export interface Tag extends WithId<Document> {
	_id: ObjectId
	name: string
	description: string
	resources: Resource[]
}