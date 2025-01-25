import type { BillingAddressDocument } from '../types/billingAddress'
import type { Model } from 'mongoose'
import { Schema, models, model } from 'mongoose'


const billingSchema = new Schema<BillingAddressDocument>({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	name: {
		type: String,
		required: true,
		lowercase: true,
		trim: true,
	},
	phone: {
		type: String,
		required: true,
		lowercase: true,
		trim: true,
	},
	street: { 								
		type: String,
		lowercase: true,
		trim: true,
	},

 	city: {
		type: String,
		trim: true,
		lowercase: true
	},
 	state: {
		type: String,
		trim: true,
		lowercase: true
	},
 	country: {
		type: String,
		trim: true,
		lowercase: true
	},
 	selectedAddress: {
		type: Boolean,
		default: false
	},
 	postcode: {
		type: String,
		trim: true,
		lowercase: true
	},
//	date: Date,

}, {
	timestamps: true,
})



// Step-3: Show virtual fields on document
billingSchema.pre(/^find/, function (this: BillingAddressDocument, next) {
	this.populate('user')

	next()
})

export const Billing: Model<BillingAddressDocument> = models.Billing || model<BillingAddressDocument>('Billing', billingSchema)
export default Billing
