import type { Types, Document } from 'mongoose'
import type { Image } from './product'

// export type ReviewDocument = {
// 	id: string
// 	user: string 				// user = userId then it will be resolve by field level resolvers 
// 	product: string 		// product === productID
// 	review: string 			// comment field
// 	liked: number
// 	disliked: number
// }

export type ReviewDocument = Document & {
	populate(arg0: string): unknown
	// _id: Types.ObjectId,
	// id: string,
	// createdAt: Date,
	// updatedAt: Date

	user: Types.ObjectId, 				
	product: Types.ObjectId,
	review: string, 							// used for review
	comment: string, 							// comment field
	likes: Types.ObjectId[],
	dislikes: Types.ObjectId[],
	image: Image
	ratings: number, 			

	replyTo: Types.ObjectId, 			// Review.comment 
}

export type CreateReview = {
	user: Types.ObjectId,
	product: Types.ObjectId,
	review: string
	comment: string, 			// comment field
	image: Image
	ratings: number, 			

	replyTo: Types.ObjectId, 			// Review.comment 
}
export type UpdateReview = {
	product: Types.ObjectId,
	review: string
	comment: string, 			// comment field
	image: Image
	ratings: number, 			

	replyTo: Types.ObjectId, 			// Review.comment 
}
