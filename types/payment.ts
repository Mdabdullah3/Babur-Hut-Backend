import { Types, Document } from 'mongoose'

type ShippingInfo = {
	name: string
	phone: string
	email : string
	method: string
	address1: string
	address2: string
	city: string
	state: string
	postcode: string
	country: string
	deliveryFee: string
}

// check order.ts if need extra info
export type PaymentDocument = Document & {
	transactionId: Types.ObjectId
	user: Types.ObjectId
	product: Types.ObjectId
	price: number
	currency: string
	status: string
	paymentType: string

	shippingInfo: ShippingInfo
}

export type PaymentUpdate = {
	status: string
}
