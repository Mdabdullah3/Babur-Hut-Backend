import type { PayableDocument } from '../types/payblePayment'
import type { Model } from 'mongoose'
import { Schema, models, model } from 'mongoose'

/*
	user: Types.ObjectId, 				// vendor
	profit: string
	vendorName: string
	phone: strin
	email: string
	totalEarning: string
	totalOrder: string
*/

const payableSchema = new Schema<PayableDocument>({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	profit: {
		type: String,
		lowercase: true,
		trim: true,
	},
	vendorName: {
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
	totalEarning: {
		type: String,
		lowercase: true,
		trim: true,
		required: true
	},
	totalOrder: {
		type: String,
		lowercase: true,
		trim: true,
		required: true
	},

}, {
	timestamps: true,
})



export const PayablePayment: Model<PayableDocument> = models.PayablePayment || model<PayableDocument>('PayablePayment', payableSchema)
export default PayablePayment
