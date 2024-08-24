// import passport from 'passport'
import { Router } from 'express'
import * as authController from '../controllers/authController'

// => /api/auth/
export const router = Router()

router
	.post('/update-email', authController.protect, authController.sendUpdateEmailRequest)
	.get('/update-email/:resetToken', authController.protect, authController.updateEmail)

	.post('/update-phone', authController.protect, authController.sendUpdatePhoneRequest)
	.patch('/update-phone', authController.protect, authController.updatePhone)

router
	.post('/register', authController.register)
	.post('/login', authController.login)
	.post('/logout', authController.logout)

	.post('/forgot-password', authController.forgotPassword)
	.patch('/reset-password', authController.resetPassword)
	.patch('/update-password', authController.protect, authController.updatePassword)

	.post('/send-otp', authController.sendOTP)
	.post('/verify-otp', authController.verifyOTP)

	// .get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
	// .get('/google/callback', authController.googleCallbackHandler)

	.get('/google', authController.googleLoginRequest)
	.get('/google/callback', authController.googleCallbackHandler)
	.get('/google/success/', authController.googleSuccessHandler)
	.get('/google/failure/', authController.googleAuthFailure)

