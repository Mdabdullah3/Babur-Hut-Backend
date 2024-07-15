import { Router } from 'express'
import * as packageController from '../controllers/packageController'

// => /api/vouchers/
export const router = Router({ mergeParams: true })

router.route('/')
	.get(packageController.getAllPackages)
	.post(packageController.addPackage)

router.route('/:packageId')
	.get(packageController.getPackageById)
	.patch(packageController.updatePackage)
	.delete(packageController.deletePackage)
