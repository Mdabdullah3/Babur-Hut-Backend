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

	shippingChargeType: "string",
	commissionType: "string",
	vatType: "string",
	transactionCostType: "string",

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
		unique: true,
		trim: true,
		lowercase: true,
	},
	shippingCharge: {
		type: String,
		trim: true,
		lowercase: true,
	},
	shippingChargeType: {
		type: String,
		trim: true,
		lowercase: true,
	},
	vat: {
		type: String,
		trim: true,
		lowercase: true,
	},
	vatType: {
		type: String,
		trim: true,
		lowercase: true,
	},
	status: {
		type: String,
		trim: true,
		lowercase: true,
	},
	commission: {
		type: String,
		trim: true,
		lowercase: true,
	},
	commissionType: {
		type: String,
		trim: true,
		lowercase: true,
	},

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

	transactionCost: {
		type: String,
		trim: true,
		lowercase: true,
	},
	transactionCostType: {
		type: String,
		trim: true,
		lowercase: true,
	},

}, {
	timestamps: true,
})


// subCategorySchema.pre(/^find/, function (this: SubCategoryDocument, next) {

// 	this.populate('category')

// 	next()
// })

export const SubCategory: Model<SubCategoryDocument> = models.SubCategory || model<SubCategoryDocument>('SubCategory', subCategorySchema)
export default SubCategory
