import { Router } from 'express'
import * as productVariantController from '../controllers/productVariantController'

// => /api/product-variants/
export const router = Router({ mergeParams: true })

router.route('/')
	.get(productVariantController.getProductVariants)
	.post(productVariantController.addProductVariant)

router.route('/:productVariantId')
	.get(productVariantController.getProductVariantById)
	.patch(productVariantController.updateProductVariant)
	.delete(productVariantController.deleteProductVariant)
