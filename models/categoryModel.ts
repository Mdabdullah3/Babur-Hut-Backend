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
		unique: true
	},
	shippingCharge: String,
	vat: String,
	status: String,
	commission: String,

	subCategories: [{ 													
		type: Schema.Types.ObjectId, 			// categoryId
		ref: 'SubCategory',
	}],
}, {
	timestamps: true,
})


export const Category: Model<CategoryDocument> = models.Category || model<CategoryDocument>('Category', categorySchema)
export default Category
