import { Router } from 'express'
import { router as reviewRouter } from '../routes/reviewRoutes'
import * as productController from '../controllers/productController'
import * as authController from '../controllers/authController'

// => /api/products/
// => /api/users/:userId/products/
export const router = Router({ mergeParams: true })

router.use('/:productId/reviews', reviewRouter)
router.get('/get-random-products', productController.gerRandomProducts)
router.post('/many', productController.getlProductsByIds)

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


router.get('/:productId/like', authController.protect, productController.updateProductLike)

// GET /api/products/:productId/like