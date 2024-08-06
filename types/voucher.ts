import { Types } from 'mongoose'

export type VoucherDocument = {
	_id: Types.ObjectId,
	id: string,
	createdAt: string,
	updatedAt: string

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