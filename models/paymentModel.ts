import type { PaymentDocument } from '../types/payment'
import type { Model } from 'mongoose'
import { Schema, models, model } from 'mongoose'

/*
{
	"customId": 'bhc000001',
	"status": 'active',
	"discount": 42,
}
	transactionId: Types.ObjectId
	user: Types.ObjectId
	product: Types.ObjectId
	price: number
	currency: string
	status: string
*/

const paymentSchema = new Schema<PaymentDocument>({
	transactionId: {
		type: Schema.Types.ObjectId,
		required: true,
		unique: true
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	product: {
		type: Schema.Types.ObjectId,
		ref: 'Product',
		required: true,
	},
	status: { 								
		type: String,
		lowercase: true,
		trim: true,
		enum: ['completed', 'pending'],
		default: 'pending'
	},
	price: { 								
		type: Number,
		required: true,
	},
	
	currency: {
		type: String,
		default: 'bdt',
		lowercase: true,
		trim: true
	}

}, {
	timestamps: true,
})


paymentSchema.pre('save', function(next) {
	this.price = +this.price

	next()
})

export const Payment: Model<PaymentDocument> = models.Payment || model<PaymentDocument>('Payment', paymentSchema)
export default Payment
