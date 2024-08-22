import { Router } from 'express'
import * as deliveryFeeController from '../controllers/deliveryFeeController'
import * as authController from '../controllers/authController'

// => /api/delivery-fees/
export const router = Router({ mergeParams: true })

router.route('/reset')
	.get(
		authController.protect,
		// authController.restrictTo('admin'), 
		deliveryFeeController.resetDeliveryFee
	)

router.route('/update-many')
	.patch(
		// authController.protect,
		// authController.restrictTo('admin'), 
		deliveryFeeController.updateManyDeliveryFee
	)


router.route('/')
	.get(deliveryFeeController.getDeliveryFees)
	.post(deliveryFeeController.addDeliveryFee)

router.route('/:deliveryFeeId')
	.get(deliveryFeeController.getDeliveryFeeById)
	.patch(
		// authController.protect,
		// authController.restrictTo('admin'), 
		deliveryFeeController.updateDeliveryFee
	)
	.delete(
		// authController.protect,
		// authController.restrictTo('admin'), 
		deliveryFeeController.deleteDeliveryFee
	)
