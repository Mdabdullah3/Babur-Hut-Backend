import { Router } from 'express'
import * as reviewController from '../controllers/reviewController'

// => /api/reviews/
export const router = Router({ mergeParams: true })

router.route('/')
	.get(reviewController.getAllReviews)
	.post(reviewController.addReview)

router.route('/:reviewId')
	.get(reviewController.getReviewById)
	.patch(reviewController.updateReviewById)
	.delete(reviewController.deleteReviewById)
