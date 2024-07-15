import { Types } from 'mongoose'


export type PackageDocument = {
	_id: Types.ObjectId,
	id: string,
	createdAt: string,
	updatedAt: string

	name: string
	user: Types.ObjectId
	status: string
	duration: number,
	price: number,
	maxProduct: number,
}


export type UpdatePackage = {
	name: string
	status: string
	duration: number,
	price: number,
	maxProduct: number,
}
