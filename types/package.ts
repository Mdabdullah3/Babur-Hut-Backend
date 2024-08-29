import type { Types, Document } from 'mongoose'

type Image = {
	public_id: string
	secure_url: string
}

export type PackageDocument = Document & {
	name: string
	user: Types.ObjectId
	status: string
	duration: number,
	price: number,
	maxProduct: number,
	image: Image

	description: string
}


export type UpdatePackage = {
	name: string
	status: string
	duration: number,
	price: number,
	maxProduct: number,
	image: Image
	description: string
}
