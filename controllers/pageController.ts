import type { RequestHandler } from 'express'
import { appError } from './errorController'
import { isValidObjectId } from 'mongoose'
import Product from '../models/productModel'
// import type { UserDocument } from '../types/user'
// import User from '../models/userModel'
// import { appError, catchAsync } from './errorController'
// import bcryptjs from 'bcryptjs'
// import passport from 'passport'
// import { appError } from './errorController'
// import { filterBodyForCreateUser } from '../dtos/userDto'
// import { appError, catchAsync } from './errorController'



// GET 	/register
export const register: RequestHandler = (_req, res) => {
  res.render('register', { title: 'Register Page' })
}
// // POST 	/register
// export const handleRegister: RequestHandler = catchAsync( async (req, res, next) => {
// 	const filteredBody = filterBodyForCreateUser(req.body)

// 	const findUser = await User.findOne({ email: filteredBody.email })
// 	if (findUser) return next(appError('this user already exists'))

// 	filteredBody.password = await bcryptjs.hash(req.body.password, 10) 

// 	const user = User.create( filteredBody )
// 	if(!user) return res.status(400).json({ 
// 		status: 'error', 
// 		message: 'Saving to database failed' 
// 	})
// 	res.redirect('/login');

// })

// GET 	/login
export const login:RequestHandler = (_req, res) => {
  res.render('login', { title: 'Login Page' })
}

// POST /login
// Method-1: 
// exports.handleLogin = (req, res) => {
// 	res.redirect('/')
// }

// // POST /login
// export const handleLogin:RequestHandler = (req, res, next) => {
// 	console.log(req.body)
	
// 	passport.authenticate('local', (err: unknown, user: Express.User) => {
// 		if(err) return next(err)
// 		if(!user) return next(appError('user not found'))

// 		req.login(user, (logError) => {
// 			if(logError) return next(logError)

// 			// res.redirect('/')

// 			res.json({
// 				status: 'success',
// 				data: user
// 			})
// 		})
// 	})(req, res, next)

// }



// => GET /
export const home:RequestHandler = (req, res, _next) => {
	const user = req.user

	const payload = {
 		title: 'Home Page',
		user
	}
	if( req.isAuthenticated() ) payload.user = req.user

	res.render('home', payload)
}

// => GET /error
export const error:RequestHandler = (_req, res, _next) => {
  console.log('login-failed')
	res.render('error', { title: 'Error Page' })
}


// // => GET /auth/google 	: handled in pageRoutes
// exports.googleLogin = (req, res, next) => { }




// => GET /product
export const productPage:RequestHandler = (_req, res, _next) => {
	const payload = {
		title: 'Product Page',
	}
	res.render('product/product', payload)
}

// => GET /product/:id 		: id/slug
export const productDetailsPage:RequestHandler = async (req, res, _next) => {
	try {
		const productId = req.params.id

		const filter = (isValidObjectId(productId)) ?  { _id: productId } : { slug: productId }
		const product = await Product.findOne(filter)
		if(!product) throw appError('product not found')
		
		const payload = {
			title: 'Product Detilals Page',
		}
		res.render('product/product-details', payload)

	} catch (error) {
		console.log(error)
		res.render('error')
	}

}




// => GET /dashboard/product
export const dashboardProducts:RequestHandler = (req, res, next) => {
	if(!req.user) return next(appError('req.user is not found'))

	const payload = {
		title: 'Product Page',
		logedInUser: req.user,
		logedInUserJs: JSON.stringify(req.user),
		products: [
			{
				id: '1',
				name: 'product 1',
				price: 1000
			},
			{
				id: '2',
				name: 'product 2',
				price: 2000
			},
		]
	}
	res.render('dashboard/product/product', payload)
}


// => GET /profile
export const profilePage:RequestHandler = (req, res, next) => {
	if(!req.user) return next(appError('req.user is not found'))


	const payload = {
		title: 'Profile',
		logedInUser: req.user,
		logedInUserJs: JSON.stringify(req.user),
	}

	res.render('user/profile', payload)
}


// => GET /payment-checkout 		(for demo only)
export const paymentCheckoutPage:RequestHandler = (_req, res, _next) => {

	const payload = {
		title: 'payment checkout page',
	}

	res.render('payment/checkout', payload)
}


// => POST /payment-handler 		(for demo only)
export const paymentHandlerPage:RequestHandler = (req, res, next) => {

	const { price, transactionId, ...data } = req.body

	if(!price || transactionId) return next(appError('price and transactionId is required fields'))


	const payload = {
		title: 'payment handler page',
		data,
		dataJs: JSON.stringify(data),
	}

	res.render('payment/handler', payload)
}


