import type { ReportDocument } from '../types/report'
import type { Model } from 'mongoose'
import { Schema, models, model } from 'mongoose'
import { sanitizeSchema } from '../services/sanitizeService'

/*
	user: Types.ObjectId,
	title: string
	message: string
	description: string
*/

const reportSchema = new Schema<ReportDocument>({
	product: {
		type: Schema.Types.ObjectId,
		ref: 'Product',
		// required: true
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	title: {
		type: String,
		lowercase: true,
		trim: true,
		required: true
	},
	message: {
		type: String,
		lowercase: true,
		trim: true,
		required: true
	},
	description: {
		type: String,
		lowercase: true,
		trim: true,
	},
	image: {
		public_id: String,
		secure_url: String,
	},

}, {
	timestamps: true,
})


reportSchema.plugin(sanitizeSchema)

export const Report: Model<ReportDocument> = models.Report || model<ReportDocument>('Report', reportSchema)
export default Report
