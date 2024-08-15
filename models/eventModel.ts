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
		lowercase: true
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
})



export const Event: Model<EventsDocument> = models.Event || model<EventsDocument>('Event', eventSchema)
export default Event
