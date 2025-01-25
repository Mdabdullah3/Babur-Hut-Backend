import { Router } from 'express'
import * as voucherController from '../controllers/billingAddressController'

// => /api/billing-addresses/
// => /api/users/:userId/billing-addresses/
export const router = Router({ mergeParams: true })

router.route('/')
	.get(voucherController.getAllBillingAddresses)
	.post(voucherController.addBillingAddress)

router.route('/:billingId')
	.get(voucherController.getBillingAddressById)
	.patch(voucherController.updateBillingAddress)
	.delete(voucherController.deleteBillingAddress)
