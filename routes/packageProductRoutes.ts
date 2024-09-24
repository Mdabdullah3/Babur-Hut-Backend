import { Router } from 'express'
import * as packageProductController from '../controllers/packageProductController'

// => /api/package-products/
export const router = Router({ mergeParams: true })

router.post('/many', packageProductController.getlPackageProductsByIds)

router.route('/')
	.get(packageProductController.getPackageProducts)
	.post(packageProductController.addPackageProduct)

router.route('/:packageProductId')
	.get(packageProductController.getPackageProductById)
	.patch(packageProductController.updatePackageProduct)
	.delete(packageProductController.deletePackageProduct)
