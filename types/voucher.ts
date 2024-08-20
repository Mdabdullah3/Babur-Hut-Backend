import { Types, Document } from 'mongoose'

export type VoucherDocument = Document & {
	// _id: Types.ObjectId,
	// id: string,
	// createdAt: string,
	// updatedAt: string

	user: Types.ObjectId,
	customId: string
	voucherId: string
	status: string
	redeemCode: string
	discount: number,
	startDate: Date,
	endDate: Date,
}

// export type CreateReview = {
// 	user: Types.ObjectId,
// 	product: Types.ObjectId,
// 	review: string
// }

export type UpdateVoucher = {
	user: Types.ObjectId,
	voucherId: string
	status: string
	redeemCode: string
	discount: number,
	startDate: Date,
	endDate: Date,
}

// // type CreateReviewInput = {
// // 	id: string
// // 	user: string 				// user = userId then it will be resolve by field level resolvers 
// // 	product: string 		// product === productID
// // 	review: String 			// comment field
// // 	liked: number
// // 	disliked: number
// // }
// // type UpdateReviewInput = {
// // 	reviewId: string
// // 	id: string
// // 	user: string 				// user = userId then it will be resolve by field level resolvers 
// // 	product: string 		// product === productID
// // 	review: String 			// comment field
// // 	liked: number
// // 	disliked: number
// // }

// // export type GetReviewArgs = {
// // 	reviewId: string
// // }
// // export type CreateReviewArgs = {
// // 	input: CreateReviewInput
// // }
// // export type UpdateReviewArgs = {
// // 	input: UpdateReviewInput
// // }
// // export type DeleteReviewArgs = {
// // 	reviewId: string
// // }