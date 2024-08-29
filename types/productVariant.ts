import { Types, Document } from 'mongoose'

export type Image = {
	public_id: string
	secure_url: string
}


export type ProductVariantDocument = Document & {
	// product: Types.ObjectId
	user: Types.ObjectId
	name: string

	price: number
	discount: number
	quantity: number
	gender: string
	color: string
	material: string
	image: Image
	size: string
}

// export type CreateProduct = {
// 	product: Types.ObjectId
// 	user: Types.ObjectId
// 	name: string

// 	price: number
// 	promoPrice: number
// 	quantity: number
// 	gender: string
// 	color: string
// 	material: string
// 	image: Image
// }

// export type UpdateProduct = {
// 	product: Types.ObjectId
// 	user: Types.ObjectId
// 	name: string

// 	price: number
// 	promoPrice: number
// 	quantity: number
// 	gender: string
// 	color: string
// 	material: string
// 	image: Image
// }

