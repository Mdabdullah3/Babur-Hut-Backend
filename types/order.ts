import { Types } from 'mongoose'

type ShippingInfo = {
	method: string
	address1: string
	address2: string
	city: string
	state: string
	postcode: number,
	country: string
}

export type OrderDocument = {
	_id: Types.ObjectId
	id: string
	createdAt: Date
	updatedAt: Date

	user: Types.ObjectId
	product: Types.ObjectId
	transactionId: Types.ObjectId

	price: number
	currency: string

	shippingInfo: ShippingInfo
}

// export type CreateProduct = {
// 	user: Types.ObjectId
// 	name: string
// 	slug: string
// 	price: number
// 	summary: string
// 	description: string
// 	category: string
// 	brand: string
// 	size: string
// 	quantity: number,
// 	coverPhoto: string
// 	images: string[]
// }

// export type UpdateProduct = {
// 	name: string
// 	slug: string
// 	price: number
// 	summary: string
// 	description: string
// 	category: string
// 	brand: string
// 	size: string
// 	quantity: number,
// 	coverPhoto: string
// 	images: string[]
// }


// export type GetProductsArgs = {
// 	_page: number,
// 	_limit: number,
// 	_search: [Search, string],
// 	_sort: string
// }
// export type GetProductArgs = {
// 	slug: string
// }


// export type UpdateProduct = {
// 	// user: Types.ObjectId
// 	name: string
// 	price: number
// 	summary: string
// 	description: string
// 	category: string
// 	brand: string
// 	size: string
// 	quantity: number,
// 	coverPhoto: string
// 	images: string[]
// }

// export type DeleteProduct = {
// 	id: string
// }

