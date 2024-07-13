import type { Types } from 'mongoose'
import type { Image } from './product'

// export type ReviewDocument = {
// 	id: string
// 	user: string 				// user = userId then it will be resolve by field level resolvers 
// 	product: string 		// product === productID
// 	review: string 			// comment field
// 	liked: number
// 	disliked: number
// }

export type ReviewDocument = {
	_id: Types.ObjectId,
	id: string,
	user: Types.ObjectId, 				
	product: Types.ObjectId,
	review: string, 			// comment field
	comment: string, 			// comment field
	likes: Types.ObjectId[],
	dislikes: Types.ObjectId[],
	image: Image

	createdAt: Date,
	updatedAt: Date
}

export type CreateReview = {
	user: Types.ObjectId,
	product: Types.ObjectId,
	review: string
}
export type UpdateReview = {
	product: Types.ObjectId,
}

// type CreateReviewInput = {
// 	id: string
// 	user: string 				// user = userId then it will be resolve by field level resolvers 
// 	product: string 		// product === productID
// 	review: String 			// comment field
// 	liked: number
// 	disliked: number
// }
// type UpdateReviewInput = {
// 	reviewId: string
// 	id: string
// 	user: string 				// user = userId then it will be resolve by field level resolvers 
// 	product: string 		// product === productID
// 	review: String 			// comment field
// 	liked: number
// 	disliked: number
// }

// export type GetReviewArgs = {
// 	reviewId: string
// }
// export type CreateReviewArgs = {
// 	input: CreateReviewInput
// }
// export type UpdateReviewArgs = {
// 	input: UpdateReviewInput
// }
// export type DeleteReviewArgs = {
// 	reviewId: string
// }