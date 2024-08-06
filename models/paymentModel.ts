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

	paymentType: {
		type: String,
		lowercase: true,
		trim: true,
		enum: ['online', 'cash'],
		default: 'cash'
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
	},


	shippingInfo: {
	  name: {
			type: String,
			lowercase: true,
			trim: true,
			maxlength: 50,
			required: 'true'
		},

	  phone: {
			type: String,
			lowercase: true,
			trim: true,
			maxlength: 15,
			required: 'true'
		},

	  email: {
			type: String,
			lowercase: true,
			trim: true,
			maxlength: 50,
			required: 'true'
		},

	  method: {
			type: String,
			lowercase: true,
			trim: true,
			maxlength: 15,
			default: 'Courier'
		},

	  address1: {
			type: String,
			lowercase: true,
			trim: true,
			maxlength: 250,
			required: true
		},
	  address2: {
			type: String,
			lowercase: true,
			trim: true,
			maxlength: 250,
			default: ''
		},

	  city: {
			type: String,
			lowercase: true,
			trim: true,
			maxlength: 150,
			default: 'dhaka'
		},

	  state: {
			type: String,
			lowercase: true,
			trim: true,
			maxlength: 150,
			default: 'dhaka'
		},

	  postcode: {
			type: String,
			lowercase: true,
			trim: true,
			maxlength: 6,
			default: ''
		},
	  country: {
			type: String,
			lowercase: true,
			trim: true,
			maxlength: 20,
			default: 'Bangladesh'
		},
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
