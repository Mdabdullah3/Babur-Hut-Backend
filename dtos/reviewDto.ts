/* DTO = Data Transfer Object */
import { CreateReview, ReviewDocument, UpdateReview } from '../types/review'
import { filterObjectByArray } from '../utils'


export const filterReviewDocument = (review: ReviewDocument) => {
	const allowedFields = [
		'user', 				// user._id
		'product', 			// product._id
		'review',
		
		'_id',
		'id',
		'createdAt',
	]
	return filterObjectByArray(review, allowedFields)
}

// => POST /api/reviews
export const filterBodyForCreateReview = (body: CreateReview) => {
	const allowedFields = [
		'user', 				// user._id
		'product', 			// product._id
		'review',
		// 'type',
		// 'chat', 				// chatId
	]

	return filterObjectByArray(body, allowedFields)
}

// => PATCH /api/reviews/:id
export const filterBodyForUpdateReview = (body: UpdateReview) => {
	const allowedFields = [
		'review',
	]

	return filterObjectByArray(body, allowedFields)
}


