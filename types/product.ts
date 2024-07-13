import { Types } from 'mongoose'

export type Image = {
	public_id: string
	secure_url: string
}

type Specifications = {
	screenSize: string,
	batteryLife: string,
	cameraResolution: string,
	storageCapacity: string,
	os: string,
	size: string,
	material: string,
	color: string,
	gender: string
}
export type ProductDocument = {
	_id: Types.ObjectId
	id: string
	vendorId: string
	createdAt: Date
	updatedAt: Date

	user: Types.ObjectId
	name: string
	price: number
	summary: string
	description: string
	category: string
	brand: string
	size: string
	quantity: number,
	coverPhoto: Image
	images: Image[]
	video: Image

	slug: string
	stock: number
	sold: number
	revenue: number
	numReviews: number
	ratings: number

	specifications: Specifications
	isLiked: boolean

}

export type CreateProduct = {
	user: Types.ObjectId
	name: string
	slug: string
	price: number
	summary: string
	description: string
	category: string
	brand: string
	size: string
	quantity: number,
	coverPhoto: string
	images: string[]
	video: Image

	specifications: Specifications
	isLiked: boolean
}

export type UpdateProduct = {
	name: string
	slug: string
	price: number
	summary: string
	description: string
	category: string
	brand: string
	size: string
	quantity: number,
	coverPhoto: string
	images: string[]
	video: Image

	specifications: Specifications
	isLiked: boolean
}

