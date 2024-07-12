import { Router } from 'express'
import { router as reviewRouter } from '../routes/reviewRoutes'
import * as productController from '../controllers/productController'
import * as authController from '../controllers/authController'

// => /api/products/
export const router = Router()

router.use('/:productId/reviews', reviewRouter)

router.get('/get-random-products', productController.gerRandomProducts)

router.route('/')
	.get(productController.getAllProducts)
	.post(
		authController.protect,
		productController.addProduct
		)

router.route('/:productId')
	.get(productController.getProductByIdOrSlug)
	.patch(productController.updateProductByIdOrSlug)
	.delete(productController.deleteProductByIdOrSlug)