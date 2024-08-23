import type { SubCategoryDocument } from '../types/category'
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

const subCategorySchema = new Schema<SubCategoryDocument>({
	category: {
		type: Schema.Types.ObjectId,
		ref: 'Category',
		required: true
	},
	name: {
		type: String,
		required: true,
		unique: true
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

	transactionCost: String

}, {
	timestamps: true,
})


// subCategorySchema.pre(/^find/, function (this: SubCategoryDocument, next) {

// 	this.populate('category')

// 	next()
// })

export const SubCategory: Model<SubCategoryDocument> = models.SubCategory || model<SubCategoryDocument>('SubCategory', subCategorySchema)
export default SubCategory
