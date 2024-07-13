import type { ReviewDocument } from '../types/review'
import type { Model } from 'mongoose'
import { Schema, models, model } from 'mongoose'

/*
{
	"user": "user-asdfasdjfa",
	"product": "product-asdfalksdjfasjj",
	"review": "this is my review 1",
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

	// reviewRatings: { 					// product.ratings == avarage([reviewRatings, ... ])
	// 	type: Number,
	// 	default: 1,
	// 	min: 1,
	// 	max: 5
	// },

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

}, {
	timestamps: true,
})



reviewSchema.pre(/^find/, function(next) {
	// this.populate({
	// 	// model: models['reviews'],
	// 	// model: models.reviews,
	// 	path: 'user',
	// 	select: 'name email avatar'
	// })

	next()
})




export const Review: Model<ReviewDocument> = models.Review || model<ReviewDocument>('Review', reviewSchema)
export default Review
