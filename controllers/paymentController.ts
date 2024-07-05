import type { RequestHandler } from 'express'
// import type { LogedInUser } from '../types/user'
// import { Types } from 'mongoose'
import { appError, catchAsync } from './errorController'
import Product from '../models/productModel'
import { generateRandomVendorId } from '../utils'


// // eslint-disable-next-line @typescript-eslint/no-var-requires
// const SSLCommerzPayment = require('sslcommerz-lts') 			// import syntax throw error

// const { SSL_COMMERZ_STORE_ID, SSL_COMMERZ_STORE_PASSWD, SSL_COMMERZ_IS_LIVE } = process.env

// if( 
// 	!SSL_COMMERZ_STORE_ID || 
// 	!SSL_COMMERZ_STORE_PASSWD || 
// 	!SSL_COMMERZ_IS_LIVE
// ) throw new Error('sslcommerz credentials missing')


// const sslcommerz = new SSLCommerzPayment({
//   store_id: SSL_COMMERZ_STORE_ID,
//   store_passwd: SSL_COMMERZ_STORE_PASSWD,
//   is_live: !!SSL_COMMERZ_IS_LIVE,
// });







/*
body {
	"product": "667ea9b1df5d6c0e864f1841",
	"price": 300,
	"currency": "BDT",

	"shippingInfo" : {
	  "name": "user another name for shipping",
		"method": "Courier",
		"address1": "shipping address",
		"address2": "",
		"city": "Dhaka",
		"state": "Dhaka",
		"postcode": 1000,
		"country": "Bangladesh"
	}
}
*/

// // POST 	/api/payments/payment-request + authController.protect
// export const createPaymentRequest:RequestHandler = catchAsync( async (req, res, next) => {
// 	const productId = req.body.product

// 	const user = req.user as LogedInUser
// 	const userId = user._id

// 	// console.log(user)

// 	const product = await Product.findById(productId)
// 	if(!product) return next(appError(`no product found by productId: ${productId}`))

// 	req.body.user = userId 						// make sure user is logend in
// 	req.body.price = product.price 		// override user value with real product value, no way to modify from client

// 	const transactionId = new Types.ObjectId()
// 	const successUrl = `${req.protocol}://${req.get('host')}/api/payments/success/${transactionId}`
// 	const failedUrl = `${req.protocol}://${req.get('host')}/api/payments/failed/${transactionId}`


// 	const data = {
// 		total_amount: product.price,
// 		currency: req.body.currency,
// 		tran_id: transactionId, // use unique tran_id for each api call

// 		success_url: successUrl,
// 		fail_url: failedUrl,
// 		cancel_url: `${process.env.CLIENT_ORIGIN}/cancel`,
// 		// ipn_url: 'http://localhost:3030/ipn',

// 		shipping_method: req.body.shippingInfo?.method,
// 		product_name: product.name,
// 		product_category: product.category,
// 		product_profile: 'general',

// 		cus_name: user.name,
// 		cus_email: user.email,
// 		cus_add1: user.location.address1,
// 		cus_add2: user.location.address2,
// 		cus_city: user.location.city,
// 		cus_state: user.location.state,
// 		cus_postcode: user.location.postcode,
// 		cus_country: user.location.country,
// 		cus_phone: user.phone,
// 		cus_fax: user.phone,
// 		ship_name: req.body.shippingInfo?.name || user.name,

// 		ship_add1: req.body.shippingInfo?.address1,
// 		ship_add2: req.body.shippingInfo?.address2,
// 		ship_city: req.body.shippingInfo?.city,
// 		ship_state: req.body.shippingInfo?.state,
// 		ship_postcode: req.body.shippingInfo?.postcode,
// 		ship_country: req.body.shippingInfo?.country,

// 		store_id: '', 
// 		store_passwd: '', 
// 		productcategory: '', 
// 		emi_option: '',
// 	}

// 	// console.log(sslcommerz)
// 	// sslcommerz.init(data)
// 	// 	.then((response: unknown) => {
// 	// 		console.log('Initiate Response:', response);
// 	// 		// Handle response
// 	// 	})
// 	// 	.catch((error: unknown) => {
// 	// 		console.error('Error:', error);
// 	// 		// Handle error
// 	// 	})



// 	// const payment = {
// 	// 	GatewayPageURL: ''
// 	// }

// 	res.status(200).json({
// 		status: 'success',
// 		body: req.body,
// 		data: {
// 			// gatewayPageUrl: payment.GatewayPageURL
// 			...data

// 		}
// 	})

// })



// // POST 	/api/payments/success/:transactionId
// export const paymentSuccessHandler: RequestHandler = catchAsync( async (req, res, next) => {
// 	const { transitionId } = req.params

// 	const payment = await Payment.findByOneAndUpdate({ transitionId }, { isPaid: true })
// 	if( !payment ) return next(appError(`payment can't find by transitionId: ${transitionId}`))

// 	// we will redirect to another frontend page to serve
// 	// res.redirect(`http://localhost:3000/payment-success/${transactionId`) 		
// 	// if need transaction Id

// 	res.status(200).json({
// 		status: 'success',
// 		data: payment
// 	})

// })


// POST 	/api/payments/failed/:transactionId


export const createPaymentRequest:RequestHandler = catchAsync( async (req, res, next) => {
	if(!req.body) return next(appError('no body found'))

	const currentDocuments = await Product.countDocuments()
	const vendorId = generateRandomVendorId('babur hat', 'electronics', currentDocuments)
	console.log({ vendorId })

	res.json({
		status: 'success',
		data: req.body
	})
})