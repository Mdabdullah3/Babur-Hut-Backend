import type { FinanceDocument } from '../types/finance'
import type { Model } from 'mongoose'
import { Schema, models, model } from 'mongoose'

/*
	user: Types.ObjectId,
	order: Types.ObjectId,
	name: string
	brand: string
	phone: strin
	email: string
	profit: string
	orderCost: string
*/

const financeSchema = new Schema<FinanceDocument>({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	order: {
		type: Schema.Types.ObjectId,
		ref: 'Payment',
		required: true
	},
	name: {
		type: String,
		lowercase: true,
		trim: true,
		required: true
	},
	brand: {
		type: String,
		lowercase: true,
		trim: true,
		required: true
	},
	phone: {
		type: String,
		lowercase: true,
		trim: true,
		required: true
	},
	email: {
		type: String,
		lowercase: true,
		trim: true,
		required: true
	},
	profit: {
		type: String,
		lowercase: true,
		trim: true,
		required: true
	},
	orderCost: {
		type: String,
		lowercase: true,
		trim: true,
		required: true
	},

}, {
	timestamps: true,
})



export const Finance: Model<FinanceDocument> = models.Finance || model<FinanceDocument>('Finance', financeSchema)
export default Finance
