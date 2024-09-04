import type { CategoryDocument } from '../types/category'
import type { Model } from 'mongoose'
import { Schema, models, model } from 'mongoose'
import { sanitizeSchema } from '../services/sanitizeService'

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

const categorySchema = new Schema<CategoryDocument>({
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

	transactionId: {
		type: String,
		trim: true,
		lowercase: true,
	},


}, {
	timestamps: true,
	toJSON: {
		virtuals: true 		// required for virtual field 'subCategories'
	}
})

categorySchema.plugin(sanitizeSchema)

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
