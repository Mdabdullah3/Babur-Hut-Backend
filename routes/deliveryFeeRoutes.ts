import { Router } from 'express'
import * as deliveryFeeController from '../controllers/deliveryFeeController'

// => /api/delivery-fees/
export const router = Router({ mergeParams: true })

router.route('/reset')
	.get(deliveryFeeController.resetDeliveryFee)


router.route('/')
	.get(deliveryFeeController.getDeliveryFees)
	.post(deliveryFeeController.addDeliveryFee)

router.route('/:deliveryFeeId')
	.get(deliveryFeeController.getDeliveryFeeById)
	.patch(deliveryFeeController.updateDeliveryFee)
	.delete(deliveryFeeController.deleteDeliveryFee)
