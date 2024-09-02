import { Types, Document } from 'mongoose'

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

type Packaging = {
	weight: string
	height: string
	width: string
	dimension: string
}


export type ProductVariant = {
	name: string
	gender: string
	color: string
	material: string
	image: Image
	size: string

	price: string
	discount: string
	quantity: string
}

export type ProductDocument = Document & {
	customId: string
	user: Types.ObjectId
	name: string
	summary: string
	description: string
	category: string
	brand: string
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
	likes: Types.ObjectId[]

	subCategory: Types.ObjectId
	warranty: string
	packaging: Packaging
  discountPrice: string
  status: string


	// discount: string
	// price: number
	// size: string
	// quantity: number,
	productVariants: ProductVariant[]
}

export type CreateProduct = {
	customId: string
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
	images: Image[]
	video: Image

	specifications: Specifications
	
	discount: string
	subCategory: Types.ObjectId
	warranty: string
	packaging: Packaging
  discountPrice: string
  status: string


	productVariants: ProductVariant[]
}

export type UpdateProduct = {
	customId: string
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

	discount: string
	subCategory: Types.ObjectId
	warranty: string
	packaging: Packaging
  discountPrice: string
  status: string

	productVariants: ProductVariant[]
}

