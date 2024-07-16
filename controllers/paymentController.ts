import type { RequestHandler } from 'express'
import type { LogedInUser } from '../types/user'
import { Types } from 'mongoose'
import { appError, catchAsync } from './errorController'
import Product from '../models/productModel'
import Payment from '../models/paymentModel'

// // eslint-disable-next-line @typescript-eslint/no-var-requires
// const SSLCommerzPayment = require('sslcommerz-lts')
// const store_id = process.env.SSL_COMMERZ_STORE_ID
// const store_passwd = process.env.SSL_COMMERZ_STORE_PASSWD
// const is_live = process.env.SSL_COMMERZ_IS_LIVE === 'true'

// 	const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

// // eslint-disable-next-line @typescript-eslint/no-var-requires
// const SSLCommerzPayment = require('sslcommerz-lts') 			// import syntax throw error

// // const { SSL_COMMERZ_STORE_ID, SSL_COMMERZ_STORE_PASSWD, SSL_COMMERZ_IS_LIVE } = process.env

// if( 
// 	!SSL_COMMERZ_STORE_ID || 
// 	!SSL_COMMERZ_STORE_PASSWD || 
// 	!SSL_COMMERZ_IS_LIVE
// ) throw new Error('sslcommerz credentials missing')


// //     const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)

// const sslcommerz = new SSLCommerzPayment( SSL_COMMERZ_STORE_ID, SSL_COMMERZ_STORE_PASSWD, !!SSL_COMMERZ_IS_LIVE)







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


// POST 	/api/payments/request + authController.protect
export const createPaymentRequest:RequestHandler = catchAsync( async (req, res, next) => {
	const productId = req.body.product

	const user = req.user as LogedInUser
	const userId = user._id

	// console.log(user)

	const product = await Product.findById(productId)
	if(!product) return next(appError(`no product found by productId: ${productId}`))

	req.body.user = userId 						// make sure user is logend in
	req.body.price = product.price 		// override user value with real product value, no way to modify from client

	const transactionId = new Types.ObjectId()
	const successUrl = `${req.protocol}://${req.get('host')}/api/payments/success/${transactionId}`
	const failedUrl = `${req.protocol}://${req.get('host')}/api/payments/failed/${transactionId}`


	const data = {
		total_amount: product.price,
		currency: req.body.currency,
		tran_id: transactionId, // use unique tran_id for each api call

		success_url: successUrl,
		fail_url: failedUrl,
		cancel_url: `${process.env.CLIENT_ORIGIN}/cancel`,
		// ipn_url: 'http://localhost:3030/ipn',

		shipping_method: req.body.shippingInfo?.method,
		product_name: product.name,
		product_category: product.category,
		product_profile: 'general',

		cus_name: user.name,
		cus_email: user.email,
		cus_add1: user.location.address1,
		cus_add2: user.location.address2,
		cus_city: user.location.city,
		cus_state: user.location.state,
		cus_postcode: user.location.postcode,
		cus_country: user.location.country,
		cus_phone: user.phone,
		cus_fax: user.phone,
		ship_name: req.body.shippingInfo?.name || user.name,

		ship_add1: req.body.shippingInfo?.address1,
		ship_add2: req.body.shippingInfo?.address2,
		ship_city: req.body.shippingInfo?.city,
		ship_state: req.body.shippingInfo?.state,
		ship_postcode: req.body.shippingInfo?.postcode,
		ship_country: req.body.shippingInfo?.country,

		store_id: '', 
		store_passwd: '', 
		productcategory: '', 
		emi_option: '',
	}
	data


	// const api = await sslcz.init(data)
	// Insert order details into the database
	// const order = { ...planDetails, tran_id, status: 'pending'};
	// const result = ordersCollection.insertOne(order);


	// only admin or payment success can change the status  
	req.body.status = user.role === 'admin' ? req.body.status : undefined 		

	let payment = await Payment.findOne({ transactionId: req.body.transactionId })
	if(!payment) {
		req.body.transactionId = transactionId
		payment = await Payment.create(req.body)

		if(!payment) return next(appError('creating payment into database failed'))
	}

	const gatewayPageUrl = `/sslcommerz-lts/?price=${product.price}&transactionId=${transactionId}`

	res.status(200).json({
		status: 'success',
		data: { 
			gatewayPageUrl
			// gatewayPageUrl: data.GatewayPageURL
		}
	})
})



// POST 	/api/payments/success/:transactionId
export const paymentSuccessHandler: RequestHandler = catchAsync( async (req, res, next) => {
	const { transactionId } = req.params
	if( !transactionId ) return next(appError(`payment can't find by transitionId: ${transactionId}`))

	// only admin or payment success can change the status  
	// req.body.status = user.role === 'admin' ? req.body.status : undefined 		

	const payment = await Payment.findOneAndUpdate({ transactionId }, { status: 'completed' })
	if( !payment ) return next(appError(`payment can't find by transitionId: ${transactionId}`))

	// we will redirect to another frontend page to serve

	// res.redirect(`http://localhost:3000/payment-success/${transactionId}`) 		
	// res.redirect(`http://localhost:5000/`) 		

	// res.redirect('/api/users')

	res.status(200).json({
		status: 'success',
		// data: payment
		data: {
			successUrl: '/api/users',
			cancelUrl: '/',
			failed: '/',
		}
	})

})


// POST 	/api/payments/cancel/:transactionId
export const paymentCancelHandler:RequestHandler = catchAsync( async (req, res, next) => {
	const { transactionId } = req.params
	if( !transactionId ) return next(appError(`must required transitionId: ${transactionId}`))

	const transaction = await Payment.findOne({ transactionId })
	if( transaction?.status === 'completed') return next(appError("you can't cancel completed transaction"))

	const payment = await Payment.findOneAndDelete({ transactionId })
	if( !payment ) return next(appError(`payment can't deleted on cancelled transitionId: ${transactionId}`))

	res.json({
		status: 'success',
		data: payment
	})
})


// const SSLCommerzPayment = require('sslcommerz-lts')
// const store_id = '<your_store_id>'
// const store_passwd = '<your_store_password>'
// const is_live = false //true for live, false for sandbox

// export const createPaymentRequest:RequestHandler = catchAsync( async (_req, res, _next) => {
//     const data = {
//         total_amount: 100,
//         currency: 'BDT',
//         tran_id: 'REF123', // use unique tran_id for each api call
//         success_url: 'http://localhost:3030/success',
//         fail_url: 'http://localhost:3030/fail',
//         cancel_url: 'http://localhost:3030/cancel',
//         ipn_url: 'http://localhost:3030/ipn',
//         shipping_method: 'Courier',
//         product_name: 'Computer.',
//         product_category: 'Electronic',
//         product_profile: 'general',
//         cus_name: 'Customer Name',
//         cus_email: 'customer@example.com',
//         cus_add1: 'Dhaka',
//         cus_add2: 'Dhaka',
//         cus_city: 'Dhaka',
//         cus_state: 'Dhaka',
//         cus_postcode: '1000',
//         cus_country: 'Bangladesh',
//         cus_phone: '01711111111',
//         cus_fax: '01711111111',
//         ship_name: 'Customer Name',
//         ship_add1: 'Dhaka',
//         ship_add2: 'Dhaka',
//         ship_city: 'Dhaka',
//         ship_state: 'Dhaka',
//         ship_postcode: 1000,
//         ship_country: 'Bangladesh',
//     };
//     const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
		
//     sslcz.init(data).then((apiResponse: any) => {
//         // Redirect the user to payment gateway
//         const GatewayPageURL = apiResponse.GatewayPageURL
//         res.redirect(GatewayPageURL)
//         console.log('Redirecting to: ', GatewayPageURL)
//     });

// 	// res.json({
// 	// 	status: 'success',
// 	// 	data: req.body
// 	// })
// })