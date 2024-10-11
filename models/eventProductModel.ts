import type { EventProductsDocument } from '../types/eventProduct'
import type { Model } from 'mongoose'
import { Schema, models, model } from 'mongoose'

/*
	user: Types.ObjectId,
	order: Types.ObjectId,
	name: string
*/

const eventProductSchema = new Schema<EventProductsDocument>({
	event: {
		type: Schema.Types.ObjectId,
		ref: 'Event',
		required: true
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	product: {
		type: Schema.Types.ObjectId,
		ref: 'Product',
		required: true
	},
	name: {
		type: String,
		lowercase: true,
		trim: true,
	},

}, {
	timestamps: true,
})



eventProductSchema.pre(/^find/, function (this: EventProductsDocument, next) {

	this.populate('product')
	// this.populate('event') 		// it create's infinite loop

	next()
})

export const EventProduct: Model<EventProductsDocument> = models.EventProduct || model<EventProductsDocument>('EventProduct', eventProductSchema)
export default EventProduct
