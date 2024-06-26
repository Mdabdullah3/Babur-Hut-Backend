import { Router } from 'express'
import { router as pageRouter } from './pageRoutes'
import { router as fileRouter } from './fileRoutes'
import { router as authRouter } from './authRoutes'
import { router as userRouter } from './userRoutes'
import { router as productRouter } from './productRoutes'
import { router as reviewRouter } from './reviewRoutes'


// => / 	(root)
const router = Router()

router.use('/', pageRouter)
router.use('/upload', fileRouter)
router.use('/api/auth', authRouter)
router.use('/api/users', userRouter)
router.use('/api/products', productRouter)
router.use('/api/reviews', reviewRouter)


export default router
