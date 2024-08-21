
import type { RequestHandler } from 'express';
import { appError, catchAsync } from './errorController';
import Payment from '../models/paymentModel';
import { apiFeatures } from '../utils';


// GET 	/api/payments
export const getPayments: RequestHandler = catchAsync( async (req, res, _next) => {
	// const payments = await Payment.find()
	const payments = await apiFeatures(Payment, req.query, {})

	res.status(200).json({
		status: 'success',
		total: payments.length,
		data: payments
	})
})

// GET 	/api/payments/:paymentId
export const getPaymentById: RequestHandler = catchAsync( async (req, res, next) => {
	const { paymentId = ''} = req.params

	const payment = await Payment.findById(paymentId)
	if(!payment) return next(appError('no payment document found'))

	res.status(200).json({
		status: 'success',
		data: payment
	})
})

// POST 	/api/payments
export const addPayment: RequestHandler = catchAsync( async (req, res, next) => {

	const payment = await Payment.create(req.body)
	// const payment = req.body
	if(!payment) return next(appError('no payment document found'))

	res.status(201).json({
		status: 'success',
		data: payment
	})
})

// PATCH 	/api/payments/:paymentId
export const updatePayment: RequestHandler = catchAsync( async (req, res, next) => {
	const { paymentId = ''} = req.params

	const status = req.body.status

	const payment = await Payment.findByIdAndUpdate(paymentId, { status }, { new: true })
	if(!payment) return next(appError('no payment document update failed'))

	res.status(201).json({
		status: 'success',
		data: payment
	})
})

// DELETE 	/api/payments/:paymentId
export const deletePayment: RequestHandler = catchAsync( async (req, res, next) => {
	const { paymentId = ''} = req.params

	const payment = await Payment.findByIdAndDelete(paymentId)
	if(!payment) return next(appError('no payment document deletation failed'))

	res.status(204).json({
		status: 'success',
		data: payment
	})
})



