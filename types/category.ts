import { Types } from 'mongoose'

type Image = {
	public_id: string
	secure_url: string
}

export type CategoryDocument = {
	_id: Types.ObjectId,
	id: string,
	createdAt: string,
	updatedAt: string

	name: string
	shippingCharge: string
	vat: string
	status: string,
	commission: string,
	image: Image

	// subCategories: Types.ObjectId[] 		// use virtual fields instead
}

export type UpdateCagetory = {
	name: string
	shippingCharge: string
	vat: string
	status: string,
	commission: Date,
	image: Image
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
