import { Types, Document } from 'mongoose'

type Image = {
	public_id: string
	secure_url: string
}

// type Product = {
// 	user: Types.ObjectId,
// 	product: Types.ObjectId,
// }

export type EventsDocument = Document & {
	user: Types.ObjectId,
	name: string
	status: string

	image: Image
	startDate: Date
	endDate: Date

	description: string
	// products: Product[]
}

export type UpdateEvent = {
	user: Types.ObjectId,
	name: string
	status: string

	image: Image
	startDate: Date
	endDate: Date

	description: string
	// products: Product[]
}
