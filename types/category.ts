import { Types, Document } from 'mongoose'

type Image = {
	public_id: string
	secure_url: string
}

export type CategoryDocument = Document & {
	name: string
	shippingCharge: string
	vat: string
	status: string,
	commission: string,
	image: Image
	icon: string
}

export type CreateCagetory = {
	name: string
	shippingCharge: string
	vat: string
	status: string,
	commission: Date,
	image: Image
	icon: string
}
export type UpdateCagetory = {
	name: string
	shippingCharge: string
	vat: string
	status: string,
	commission: Date,
	image: Image
	icon: string
}


export type SubCategoryDocument = {
	_id: Types.ObjectId,
	id: string,
	createdAt: string,
	updatedAt: string

	category: Types.ObjectId
	name: string
	shippingCharge: string
	vat: string
	status: string,
	commission: string,
}

export type UpdateSubCagetory = {
	name: string
	shippingCharge: string
	vat: string
	status: string,
	commission: Date,
}
