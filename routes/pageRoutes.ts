import passport from 'passport'
import { Router } from 'express'
import * as pageController from '../controllers/pageController'
import * as authController from '../controllers/authController'

import { router as dashboardRouter } from './dashboardRoutes'

// => /
export const router = Router()

	router
		.get('/', pageController.home)
		.get('/register', pageController.register)
		.get('/login', pageController.login)
		.get('/error', pageController.error)

		.use('/profile', authController.protect, pageController.profilePage)
		.use('/message', authController.protect, pageController.messagePage)

		.use('/dashboard', authController.protect, dashboardRouter)
		.get('/product', pageController.productPage)
		.get('/product/:id', pageController.productDetailsPage)


		// .get('/auth/google/callback', passport.authenticate('google', { 
		// 	successRedirect: '/',
		// 	failureRedirect: '/login'
		// }))

		// // handled inside /api/auth/google, instead of /auth/google
		.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
		.get('/auth/google/callback', authController.googleCallbackHandler)


		// just for testing
		.get('/payment', pageController.paymentCheckoutPage)
		.get('/sslcommerz-lts', pageController.sslcommerzLTSHandler)

