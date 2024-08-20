import type { RequestHandler } from 'express';
import { appError, catchAsync } from './errorController';
import PayablePayment from '../models/_paymentModel';


// GET 	/api/payablePayments
export const getFinances: RequestHandler = catchAsync( async (_req, res, _next) => {
	const payablePayments = await PayablePayment.find()

	res.status(200).json({
		status: 'success',
		total: payablePayments.length,
		data: payablePayments
	})
})

// GET 	/api/payablePayments/:payablePaymentId
export const getFinanceById: RequestHandler = catchAsync( async (req, res, next) => {
	const { payablePaymentId = ''} = req.params

	const payablePayment = await PayablePayment.findById(payablePaymentId)
	if(!payablePayment) return next(appError('no payablePayment document found'))

	res.status(200).json({
		status: 'success',
		data: payablePayment
	})
})

// POST 	/api/payablePayments
export const addFinance: RequestHandler = catchAsync( async (req, res, next) => {
	const payablePayment = await PayablePayment.create(req.body)
	if(!payablePayment) return next(appError('no payablePayment document found'))

	res.status(201).json({
		status: 'success',
		data: payablePayment
	})
})

// PATCH 	/api/payablePayments/:payablePaymentId
export const updateFinance: RequestHandler = catchAsync( async (req, res, next) => {
	const { payablePaymentId = ''} = req.params

	const other = await PayablePayment.findById(payablePaymentId )
	if(!other) return next(appError('product not found'))

	const payablePayment = await PayablePayment.findByIdAndUpdate(payablePaymentId, req.body, { new: true })
	if(!payablePayment) return next(appError('no payablePayment document update failed'))

	res.status(201).json({
		status: 'success',
		data: payablePayment
	})
})

// DELETE 	/api/payablePayments/:payablePaymentId
export const deleteFinance: RequestHandler = catchAsync( async (req, res, next) => {
	const { payablePaymentId = ''} = req.params

	const payablePayment = await PayablePayment.findByIdAndDelete(payablePaymentId)
	if(!payablePayment) return next(appError('no payablePayment document deletation failed'))

	res.status(204).json({
		status: 'success',
		data: payablePayment
	})
})



