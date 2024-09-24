import { Router } from 'express'
import { router as pageRouter } from './pageRoutes'
import { router as fileRouter } from './fileRoutes'
import { router as authRouter } from './authRoutes'
import { router as userRouter } from './userRoutes'
import { router as productRouter } from './productRoutes'
import { router as productVariantRouter } from './productVariantRoutes'
import { router as reviewRouter } from './reviewRoutes'
import { router as orderRouter } from './orderRouters'
// import { router as paymentRouter } from './paymentRoutes'
import { router as voucherRouter } from './voucherRoutes'
import { router as categoryRouter } from './cagegoryRouter'
import { router as subCategoryRouter } from './subCagegoryRouter'
import { router as packageRouter } from './packageRoutes'
import { router as packageProductRouter } from './packageProductRoutes'
import { router as notificationRouter } from './notificationRoutes'
import { router as otherRouter } from './otherRoutes'
import { router as financeRouter } from './financeRoutes'
import { router as payablePaymentRouter } from './payablePaymentRoutes'
import { router as eventRouter } from './eventRoutes'
import { router as eventProductRouter } from './eventProductRoutes'
import { router as deliveryFeesRouter } from './deliveryFeeRoutes'
import { router as reportRouter } from './reportRoutes'

import { router as testRouter } from './_testRoutes' 		// just for test


// => / 	(root)
const router = Router()

// router.use('/api/test', testRouter) 			// just for testing

router.use('/', pageRouter)
router.use('/upload', fileRouter)
router.use('/api/auth', authRouter)
router.use('/api/users', userRouter)
router.use('/api/products', productRouter)
router.use('/api/product-variants', productVariantRouter)
router.use('/api/reviews', reviewRouter)
router.use('/api/orders', orderRouter)
// router.use('/api/payments', paymentRouter)
router.use('/api/notifications', notificationRouter)

router.use('/api/vouchers', voucherRouter)
router.use('/api/categories', categoryRouter)
router.use('/api/sub-categories', subCategoryRouter)
router.use('/api/packages', packageRouter)
router.use('/api/package-products', packageProductRouter)
router.use('/api/others', otherRouter)
router.use('/api/finances', financeRouter)
router.use('/api/payablePayments', payablePaymentRouter)
router.use('/api/events', eventRouter)
router.use('/api/event-products', eventProductRouter)
router.use('/api/delivery-fees', deliveryFeesRouter)
router.use('/api/reports', reportRouter)

router.use('/api/tests', testRouter)

export default router
