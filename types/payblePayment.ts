import { Types, Document } from 'mongoose'


export type PayableDocument = Document & {
	user: Types.ObjectId, 				// vendor
	profit: string
	vendorName: string
	phone: string
	email: string
	totalEarning: string
	totalOrder: string
}

export type UpdatePayable = {
	user: Types.ObjectId, 				// vendor
	profit: string
	vendorName: string
	phone: string
	email: string
	totalEarning: string
	totalOrder: string
}
