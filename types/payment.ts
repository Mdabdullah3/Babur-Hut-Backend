import { Types } from 'mongoose'

// check order.ts if need extra info
export type PaymentDocument = {
	_id: Types.ObjectId
	id: string
	createdAt: Date
	updatedAt: Date

	transactionId: Types.ObjectId
	user: Types.ObjectId
	product: Types.ObjectId
	price: number
	currency: string
	status: string
}
