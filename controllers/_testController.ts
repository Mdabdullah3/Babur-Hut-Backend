
import type { RequestHandler } from 'express';
import { appError, catchAsync } from './errorController';
import Order from '../models/_testModel';


// GET 	/api/test
export const getTest: RequestHandler = catchAsync( async (_req, res, _next) => {
	const tests = await Order.find()

	res.status(200).json({
		status: 'success',
		total: tests.length,
		data: tests
	})
})

// GET 	/api/test/:testId
export const getTestById: RequestHandler = catchAsync( async (req, res, next) => {
	const { testId = ''} = req.params

	const order = await Order.findById(testId)
	if(!order) return next(appError('no order document found'))

	res.status(200).json({
		status: 'success',
		data: order
	})
})

// POST 	/api/test
export const addTest: RequestHandler = catchAsync( async (req, res, next) => {

	const order = await Order.create(req.body)
	// const order = req.body
	if(!order) return next(appError('no order document found'))

	res.status(201).json({
		status: 'success',
		data: order
	})
})

// PATCH 	/api/finances/:testId
export const updateTest: RequestHandler = catchAsync( async (req, res, next) => {
	const { testId = ''} = req.params

	const order = await Order.findByIdAndUpdate(testId, req.body, { new: true })
	if(!order) return next(appError('no order document update failed'))

	res.status(201).json({
		status: 'success',
		data: order
	})
})

// DELETE 	/api/finances/:testId
export const deleteTest: RequestHandler = catchAsync( async (req, res, next) => {
	const { testId = ''} = req.params

	const order = await Order.findByIdAndDelete(testId)
	if(!order) return next(appError('no order document deletation failed'))

	res.status(204).json({
		status: 'success',
		data: order
	})
})



