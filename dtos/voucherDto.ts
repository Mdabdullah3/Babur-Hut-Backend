/* DTO = Data Transfer Object */
import { filterObjectByArray } from '../utils'
import type { UpdateVoucher } from '../types/voucher'


// export const filterReviewDocument = (review: ReviewDocument) => {
// 	const allowedFields = [
// 		'user', 				// user._id
// 		'product', 			// product._id
// 		'review',
		
// 		'_id',
// 		'id',
// 		'createdAt',
// 	]
// 	return filterObjectByArray(review, allowedFields)
// }

// // => POST /api/vouchers
// export const filterBodyForUpdateVoucher = (body: CreateVoucher) => {
// 	const allowedFields = [
// 		'voucherId',
// 		'status',
// 		'discount',
// 		'startDate',
// 		'endDate',
// 	]

// 	return filterObjectByArray(body, allowedFields)
// }

// => PATCH /api/reviews/:id
export const filterBodyForUpdateVoucher = (body: UpdateVoucher) => {
	const allowedFields = [
		'voucherId',
		'status',
		'discount',
		'startDate',
		'endDate',
	]

	return filterObjectByArray(body, allowedFields)
}


