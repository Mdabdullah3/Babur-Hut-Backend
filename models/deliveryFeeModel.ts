import type { DeliveryFeeDocument } from '../types/deliveryFee'
import type { Model } from 'mongoose'
import { Schema, models, model } from 'mongoose'
import { sanitizeSchema } from '../services/sanitizeService'

/*
	district: string
	deliveryFee: string
*/

const deliveryFeeSchema = new Schema<DeliveryFeeDocument>({
	district: {
		type: String,
		lowercase: true,
		trim: true,
		required: true,
		unique: true,
	},
	deliveryFee: {
		type: Number,
		trim: true,
		required: true,
	},

}, {
	timestamps: true,
})

deliveryFeeSchema.plugin(sanitizeSchema)

deliveryFeeSchema.pre('save', function(next) {
	this.deliveryFee = +this.deliveryFee 								// convert to number

	next()
})

export const DeliveryFee: Model<DeliveryFeeDocument> = models.DeliveryFee || model<DeliveryFeeDocument>('DeliveryFee', deliveryFeeSchema)
export default DeliveryFee
