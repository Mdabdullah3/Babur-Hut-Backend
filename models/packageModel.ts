import type { PackageDocument } from '../types/package'
import type { Model } from 'mongoose'
import { Schema, models, model } from 'mongoose'

/*
{
	"name": "package name",
	"user": "667ff88eb5dfd416e36015ad",
	"status": "active",
	"duration": 5,
	"price": 300,
	"maxProduct": 10,
}
*/

const packageSchema = new Schema<PackageDocument>({
	name: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		lowercase: true,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	status: { 								// Review message
		type: String,
		// required: true,
		lowercase: true,
		trim: true,
	},
	description: { 
		type: String,
		// required: true,
		lowercase: true,
		trim: true,
	},
	price: { 								
		type: Number,
		default: 0
	},
	duration: { 					
		type: Number,
		default: 0
	},
	maxProduct: { 					
		type: Number,
		default: 0
	},

	image: {
		public_id: String,
		secure_url: String,
	},

}, {
	timestamps: true,
})


packageSchema.pre('save', function(next) {
	this.price = +this.price
	this.duration = +this.duration
	this.maxProduct = +this.maxProduct

	next()
})

export const Package: Model<PackageDocument> = models.Package || model<PackageDocument>('Package', packageSchema)
export default Package
