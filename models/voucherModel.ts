import type { VoucherDocument } from '../types/voucher'
import type { Model } from 'mongoose'
import { Schema, models, model } from 'mongoose'
import { sanitizeSchema } from '../services/sanitizeService'

/*
{
	"customId": 'bhc000001',
	"status": 'active',
	"discount": 42,
}
*/

const voucherSchema = new Schema<VoucherDocument>({
	voucherId: String,
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	customId: {
		type: String,
		required: true,
		unique: true,
	},
	status: { 								// Review message
		type: String,
		// required: true,
		lowercase: true,
		trim: true,
	},
	redeemCode: { 								
		type: String,
		lowercase: true,
		trim: true,
	},
	discount: { 								// Review message
		type: Number,
		// required: true,
	},
	startDate: Date,
	endDate: Date,

 	discountType: {
		type: String,
		trim: true,
		lowercase: true
	},
 	minimumPurchase: {
		type: String,
		trim: true,
		lowercase: true
	}

}, {
	timestamps: true,
})

voucherSchema.plugin(sanitizeSchema)

voucherSchema.pre('save', function(next) {
	this.discount = +this.discount

	next()
})

// Step-3: Show virtual fields on document
voucherSchema.pre(/^find/, function (this: VoucherDocument, next) {
	this.populate('user')

	next()
})

export const Voucher: Model<VoucherDocument> = models.Voucher || model<VoucherDocument>('Voucher', voucherSchema)
export default Voucher
