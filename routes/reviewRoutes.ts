import { Router } from 'express'
import * as reviewController from '../controllers/reviewController'
import * as authController from '../controllers/authController'

// => /api/reviews/
// => /api/products/:productId/reviews/
// => /api/users/:userId/reviews/
export const router = Router({ mergeParams: true })

router.route('/')
	.get(reviewController.getAllReviews)
	.post(
		authController.protect,
		reviewController.addReview
	)

router.route('/:reviewId')
	.get(reviewController.getReviewById)
	.patch(reviewController.updateReviewById)
	.delete(reviewController.deleteReviewById)
