import type { ProductVariantDocument } from '../types/productVariant'
import type { Model } from 'mongoose'
import { Schema, models, model } from 'mongoose'

/*
{
	"product": 'product._id', 							(*)
	"user": 'user._id',
	"image": 'data:image/jpb,asdjfakjdfajdf',

	name: string
	price: number 													(*)
	discount: number
	quantity: number
	gender: string
	color: string
	material: string
	size: string 														(*)
}
*/

const productVariantSchema = new Schema<ProductVariantDocument>({
	// product: {
	// 	type: Schema.Types.ObjectId,
	// 	ref: 'Product',
	// 	required: true
	// },
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},

	name: {
		type: String,
		trim: true,
		lowercase: true,
	},
	image: {
		public_id: String,
		secure_url: String,
	},

	price: {
		type: Number,
		required: true,
	},
	discount: {
		type: Number,
	},
	quantity: {
		type: Number,
		default: 1
	},

	gender: {
		type: String,
		trim: true,
		lowercase: true,
	},
	color: {
		type: String,
		trim: true,
		lowercase: true,
	},
	material: {
		type: String,
		trim: true,
		lowercase: true,
	},
	size: {
		type: String,
		trim: true,
		lowercase: true,
		required: true,
	},

}, {
	timestamps: true,
})


productVariantSchema.pre('save', function(next) {
	this.price = +this.price 								// convert to number
	this.discount = +this.discount 					
	this.quantity = +this.quantity

	next()
})

export const ProductVariant: Model<ProductVariantDocument> = models.ProductVariant || model<ProductVariantDocument>('ProductVariant', productVariantSchema)
export default ProductVariant
