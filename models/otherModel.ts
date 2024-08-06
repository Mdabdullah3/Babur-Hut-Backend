import type { OtherDocument } from '../types/other'
import type { Model } from 'mongoose'
import { Schema, models, model } from 'mongoose'

/*
{
	"user": 'user._id',
	"image": 'data:image/jpb,asdjfakjdfajdf',
}
*/

const otherSchema = new Schema<OtherDocument>({
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

}, {
	timestamps: true,
})



export const Other: Model<OtherDocument> = models.Other || model<OtherDocument>('Other', otherSchema)
export default Other
