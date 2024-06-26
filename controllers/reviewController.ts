import type { RequestHandler } from 'express'
import type { ReviewDocument } from '../types/review'
import Review from '../models/reviewModel'
import { appError, catchAsync } from './errorController'
import { apiFeatures } from '../utils'
import * as reviewDto from '../dtos/reviewDto'

/*
{
	"user": "user-asdfasdjfa",
	"product": "product-asdfalksdjfasjj",
	"review": "this is my review 1",
}
*/

// GET /api/reviews
// GET /api/products/:productId/reviews
export const getAllReviews:RequestHandler = catchAsync( async (req, res, _next) => {
	const productId = req.params.productId
	
	const filter = productId ? { product: productId.toString() } : {}
	// const reviews = await Review.find<ReviewDocument>(filter)
	const reviews:ReviewDocument[] = await apiFeatures(Review, req.query, filter)

	res.json({
		status: 'success',
		total: reviews.length,
		data: reviews
	})
})

// POST /api/reviews
// POST /api/products/:productId/reviews
export const addReview:RequestHandler = catchAsync(async (req, res, next) => {

	const review = await Review.create(req.body)
	// const review = req.body
	if(!review) return next(appError('product not found'))
	
	res.json({
		status: 'success',
		data: review
	})
})


// GET /api/reviews/:reviewId
// GET /api/products/:productId/reviews/:reviewId
export const getReviewById:RequestHandler = catchAsync(async (req, res, next) => {
	const reviewId = req.params.reviewId
	// const productId = req.params.productId
	// console.log({ reviewId, productId })

	const filter = { _id: reviewId }
	const reviews = await apiFeatures(Review, req.query, filter).limit(1)
	if(!reviews.length) return next(appError('review not found'))
	
	res.status(200).json({
		status: 'success',
		data: reviews[0]
	})
})

// PATCH /api/reviews/:reviewId
export const updateReviewById:RequestHandler = catchAsync(async (req, res, next) => {
	const reviewId = req.params.reviewId

	const filteredBody = reviewDto.filterBodyForUpdateReview(req.body)
	const review = await Review.findByIdAndUpdate(reviewId, filteredBody, { new: true })
	if(!review) return next(appError('review not found'))
	
	res.status(200).json({
		status: 'success',
		data: review
	})
})

// DELETE /api/reviews/:reviewId
export const deleteReviewById:RequestHandler = catchAsync(async (req, res, next) => {
	const reviewId = req.params.reviewId

	const review = await Review.findByIdAndDelete(reviewId)
	if(!review) return next(appError('review not found'))
	
	res.status(204).json({
		status: 'success',
		data: review
	})
})