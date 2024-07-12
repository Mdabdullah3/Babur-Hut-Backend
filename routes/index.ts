import { Router } from 'express'
import { router as pageRouter } from './pageRoutes'
import { router as fileRouter } from './fileRoutes'
import { router as authRouter } from './authRoutes'
import { router as userRouter } from './userRoutes'
import { router as productRouter } from './productRoutes'
import { router as reviewRouter } from './reviewRoutes'
import { router as paymentRouter } from './paymentRoutes'
import { router as voucherRouter } from './voucherRoutes'


// => / 	(root)
const router = Router()

router.use('/', pageRouter)
router.use('/upload', fileRouter)
router.use('/api/auth', authRouter)
router.use('/api/users', userRouter)
router.use('/api/products', productRouter)
router.use('/api/reviews', reviewRouter)
router.use('/api/payments', paymentRouter)

router.use('/api/vouchers', voucherRouter)

export default router
