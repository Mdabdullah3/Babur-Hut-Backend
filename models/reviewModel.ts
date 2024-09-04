import type { ReviewDocument } from '../types/review'
import type { Model } from 'mongoose'
import { Schema, models, model } from 'mongoose'
import { sanitizeSchema } from '../services/sanitizeService'

/*
{
	"user": "user-asdfasdjfa",
	"product": "product-asdfalksdjfasjj",
	"review": "this is my review 1",
	"comment": "this is my comment 1",
	"image": "data:...",

	"replyTo": "review.comment.id",
}
*/

const reviewSchema = new Schema<ReviewDocument>({
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
	review: { 								// Review message
		type: String,
		// required: true,
		lowercase: true,
		trim: true,
		maxLength: 200,
		minLength: 5
	},
	comment: { 								// Review message
		type: String,
		// required: true,
		lowercase: true,
		trim: true,
		maxLength: 200,
		minLength: 5
	},
	image: {
		public_id: {
			type: String,
			// required: true,
		},
		secure_url: {
			type: String,
			// required: true,
		}

	},

	ratings: { 							// will be calculated from 'reviews' collection
		type: Number,
		default: 4
	},

	likes: [{
		type: Schema.Types.ObjectId,
		ref: 'User',
		// required: true
	}],
	dislikes: [{
		type: Schema.Types.ObjectId,
		ref: 'User',
		// required: true
	}],

	replyTo: {
		type: Schema.Types.ObjectId,
		ref: 'Review',
	},

}, {
	timestamps: true,
})

reviewSchema.plugin(sanitizeSchema)

// productSchema.pre('save', function(this) {
reviewSchema.pre('save', function(next) {
	this.ratings = +this.ratings 	

	next()
})

reviewSchema.pre(/^find/, function(next) {
	// this.populate({
	// 	// model: models['reviews'],
	// 	// model: models.reviews,
	// 	path: 'user',
	// 	select: 'name email avatar'
	// })

	this.populate('replyTo')

	next()
})


reviewSchema.pre('find', function (this: ReviewDocument, next) {
	this.populate('user')

	next()
})


export const Review: Model<ReviewDocument> = models.Review || model<ReviewDocument>('Review', reviewSchema)
export default Review
