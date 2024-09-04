import type { OtherDocument } from '../types/other'
import type { Model } from 'mongoose'
import { Schema, models, model } from 'mongoose'
import { sanitizeSchema } from '../services/sanitizeService'

/*
{
	"user": 'user._id',
	"image": 'data:image/jpb,asdjfakjdfajdf',

	mobileBanner: Image
	popupImageMobile: Image
	logo: Image
	popupImage: Image
}
*/

const otherSchema = new Schema<OtherDocument>({
	name: String,
	banner: String,
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	image: {
		public_id: String,
		secure_url: String,
	},

	mobileBanner: {
		public_id: String,
		secure_url: String,
	},

	popupImageMobile: {
		public_id: String,
		secure_url: String,
	},

	logo: {
		public_id: String,
		secure_url: String,
	},

	popupImage: {
		public_id: String,
		secure_url: String,
	},


}, {
	timestamps: true,
})


otherSchema.plugin(sanitizeSchema)

export const Other: Model<OtherDocument> = models.Other || model<OtherDocument>('Other', otherSchema)
export default Other
