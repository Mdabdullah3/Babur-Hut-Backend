import { Types, Document } from 'mongoose'


export type EventProductsDocument = Document & {
	event: Types.ObjectId, 			// To map with virtual property
	name: string

	user: Types.ObjectId,
	product: Types.ObjectId,

}

