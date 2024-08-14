import type { RequestHandler } from 'express'
import type { ReviewDocument } from '../types/review'
import type { LogedInUser } from '../types/user'
import Review from '../models/reviewModel'
import { appError, catchAsync } from './errorController'
import { apiFeatures } from '../utils'
import * as reviewDto from '../dtos/reviewDto'
import * as fileService from '../services/fileService'
import { promisify } from 'util'

/*
{
	"user": "user-asdfasdjfa",
	"product": "product-asdfalksdjfasjj",
	"review": "this is my review 1",
}
*/

// GET /api/reviews
// GET /api/products/:productId/reviews
// GET /api/users/:userId/reviews
// GET /api/users/me/reviews
export const getAllReviews:RequestHandler = catchAsync( async (req, res, _next) => {
	// const logedInUser = req.user as LogedInUser
	// const userId = logedInUser._id || req.params.userId

	const userId = req.params.userId
	const productId = req.params.productId

	let filter = {}
	if(productId) filter = { product: productId.toString() } 
	if(userId) filter = { user: userId.toString() } 

	console.log(filter)
	
	// const filter = productId ? { product: productId.toString() } : {}
	// const reviews = await Review.find<ReviewDocument>(filter)
	const reviews:ReviewDocument[] = await apiFeatures(Review, req.query, filter)

	res.json({
		status: 'success',
		total: reviews.length,
		data: reviews
	})
})

// POST /api/reviews
// POST /api/products/:productId/reviews 	+ protect
export const addReview:RequestHandler = async (req, res, next) => {
	try {
		const logedInUser = req.user as LogedInUser

		const productId = req.params.productId || req.body.product
		if(!productId?.trim()) return next(appError('productId required fields'))

		if(!req.body.review && !req.body.comment) return next(appError('must have review or comment field'))
		if(req.body.review && req.body.comment) return next(appError('must have only review or comment field, not both'))

		req.body.product = productId
		req.body.user = logedInUser._id

		if(req.body.image) {
			const { error, image } = await fileService.handleBase64File(req.body.image, '/reviews')
			if(error || !image) return next(appError('review image upload failed '))
			req.body.image = image
		}

		const review = await Review.create(req.body)
		if(!review) return next(appError('product not found'))
		
		res.json({
			status: 'success',
			data: review
		})

	} catch (err: unknown) {

		if(req.body.image) {
			setTimeout(() => {
				promisify(fileService.removeFile)(req.body.image.secure_url)
			}, 1000)
		}

		if(err instanceof Error) next(appError(err.message))
		if(typeof err === 'string') next(appError(err))
	}
}


// GET /api/reviews/:reviewId
// GET /api/products/:productId/reviews/:reviewId
// GET /api/users/:userId/reviews/:reviewId
// GET /api/users/me/reviews/:reviewId
export const getReviewById:RequestHandler = catchAsync(async (req, res, next) => {
	const reviewId = req.params.reviewId

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
	try {
		const reviewId = req.params.reviewId

		// handle image update
		if(req.body.image) {
			const { error, image } = await fileService.handleBase64File(req.body.image, '/reviews')
			if(error || !image) return next(appError('review image upload failed '))
			req.body.image = image
		}

		const review = await Review.findById(reviewId)
		if(!review) return next(appError('review not found'))

		const filteredBody = reviewDto.filterBodyForUpdateReview(req.body)
		const updatedReview = await Review.findByIdAndUpdate(reviewId, filteredBody, { new: true })
		if(!updatedReview) return next(appError('review not found'))
		
		
		// delete old images
		if(req.body.image && review.image?.secure_url) {
			setTimeout(() => {
				promisify(fileService.removeFile)(review.image.secure_url)
			}, 1000);
		}


		res.status(200).json({
			status: 'success',
			data: updatedReview
		})

	} catch (err: unknown) {

		if(req.body.image) {
			setTimeout(() => {
				promisify(fileService.removeFile)(req.body.image.secure_url)
			}, 1000)
		}

		if(err instanceof Error) next(appError(err.message))
		if(typeof err === 'string') next(appError(err))
	}
})

// DELETE /api/reviews/:reviewId
export const deleteReviewById:RequestHandler = catchAsync(async (req, res, next) => {
	try {
		const reviewId = req.params.reviewId

		const review = await Review.findByIdAndDelete(reviewId)
		if(!review) return next(appError('review not found'))
	
		// delete old image
		if(review.image?.secure_url) {
			setTimeout(() => {
				promisify(fileService.removeFile)(review.image.secure_url)
			}, 1000);
		}

		res.status(204).json({
			status: 'success',
			data: review
		})

	} catch (err: unknown) {
		setTimeout(() => {
			if( req.body.image ) {
				promisify(fileService.removeFile)(req.body.image.secure_url)
			}
		}, 1000)

		if(err instanceof Error) next(appError(err.message))
		if(typeof err === 'string') next(appError(err))
		
	}
})