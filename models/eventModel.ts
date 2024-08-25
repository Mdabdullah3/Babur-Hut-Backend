import type { EventsDocument } from '../types/event'
import type { Model } from 'mongoose'
import { Schema, models, model } from 'mongoose'

/*
{
	user: Types.ObjectId,
	name: string
	status: string

	image: Image
	startDate: Date
	endDate: Date
}
*/

const eventSchema = new Schema<EventsDocument>({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	image: {
		public_id: String,
		secure_url: String,
		alt: String,
		size: String
	},
	name: {
		type: String,
		trim: true,
		required: true,
		lowercase: true,
		// unique: true,
	},
	status: {
		type: String,
		trim: true,
		required: true,
		lowercase: true
	},
	startDate: Date,
	endDate: Date,


}, {
	timestamps: true,
	toJSON: {
		virtuals: true 	// Step-1: required for virtual field 'reviews'
	}
})


// // Step-2: Generate virtual field: 'reviews' from Review model where Review.product === product._id
eventSchema.virtual('eventProducts', {
	ref: 'EventProduct',
	foreignField: 'event',
	localField: '_id'
})

// Step-3: Show virtual fields on document
eventSchema.pre(/^find/, function (this: EventsDocument, next) {
	this.populate('eventProducts')
	next()
})


export const Event: Model<EventsDocument> = models.Event || model<EventsDocument>('Event', eventSchema)
export default Event
