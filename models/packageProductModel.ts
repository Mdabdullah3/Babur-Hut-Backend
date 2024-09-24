import type { PackageProductsDocument } from '../types/packageProduct'
import type { Model } from 'mongoose'
import { Schema, models, model } from 'mongoose'
import { sanitizeSchema } from '../services/sanitizeService'

/*
	user: Types.ObjectId,
	order: Types.ObjectId,
	name: string
*/

const packageProductSchema = new Schema<PackageProductsDocument>({
	package: {
		type: Schema.Types.ObjectId,
		ref: 'Package',
		required: true
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	product: {
		type: Schema.Types.ObjectId,
		ref: 'Product',
		required: true
	},
	name: {
		type: String,
		lowercase: true,
		trim: true,
	},

}, {
	timestamps: true,
})


packageProductSchema.plugin(sanitizeSchema)

// Step-3: Show virtual fields on document
packageProductSchema.pre(/^find/, function (this: PackageProductsDocument, next) {

	this.populate('product')
	// this.populate('package') 		// it create's infinite loop

	next()
})

export const PackageProduct: Model<PackageProductsDocument> = models.PackageProduct || model<PackageProductsDocument>('PackageProduct', packageProductSchema)
export default PackageProduct
