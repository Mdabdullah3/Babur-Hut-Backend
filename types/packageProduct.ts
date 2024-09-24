import { Types, Document } from 'mongoose'


export type PackageProductsDocument = Document & {
	package: Types.ObjectId, 			// To map with virtual property
	name: string

	user: Types.ObjectId,
	product: Types.ObjectId,
}

