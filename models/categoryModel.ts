import type { CategoryDocument } from '../types/category'
import type { Model } from 'mongoose'
import { Schema, models, model } from 'mongoose'

/*
{
	name: "string",
	shippingCharge: "string",
	vat: "string",
	status: "string",
	commission: "string",
}
*/

const categorySchema = new Schema<CategoryDocument>({
	name: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		lowercase: true,
	},
	shippingCharge: String,
	vat: String,
	status: String,
	commission: String,

	image: {
		public_id: String,
		secure_url: String,
		alt: String,
		size: String
	},
	icon: {
		type: String,
		trim: true,
		lowercase: true,
	},

	transactionCost: String,
	transactionId: String,

}, {
	timestamps: true,
	toJSON: {
		virtuals: true 		// required for virtual field 'subCategories'
	}
})


// Step-2: Create virtual fields on document
categorySchema.virtual('subCategories', {
	ref: 'SubCategory',
	foreignField: 'category', 				// SubCategory's category fields will be mapped 
	localField: '_id', 								// with localField's _id, because both are same in this 2 schema
})

// Step-3: Show virtual fields on document
categorySchema.pre(/^find/, function (this: CategoryDocument, next) {
	this.populate('subCategories')

	next()
})


export const Category: Model<CategoryDocument> = models.Category || model<CategoryDocument>('Category', categorySchema)
export default Category
