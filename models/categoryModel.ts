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
	name: String,
	shippingCharge: String,
	vat: String,
	status: String,
	commission: String,
}, {
	timestamps: true,
})


export const Category: Model<CategoryDocument> = models.Category || model<CategoryDocument>('Category', categorySchema)
export default Category
