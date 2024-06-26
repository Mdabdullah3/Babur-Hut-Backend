import { Router } from 'express'
import * as pageController from '../controllers/pageController'

// => /dashboard/
export const router = Router()

router
	.get('/product', pageController.dashboardProducts)




