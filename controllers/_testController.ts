import type { RequestHandler } from 'express';
import { appError, catchAsync } from './errorController';
import Test from '../models/_testModel';


// GET 	/api/tests
export const getTest: RequestHandler = catchAsync( async (_req, res, _next) => {
	const tests = await Test.find()

	res.status(200).json({
		status: 'success',
		total: tests.length,
		data: tests
	})
})

// GET 	/api/tests/:testId
export const getTestById: RequestHandler = catchAsync( async (req, res, next) => {
	const { testId = ''} = req.params

	const test = await Test.findById(testId)
	if(!test) return next(appError('no test document found'))

	res.status(200).json({
		status: 'success',
		data: test
	})
})

// POST 	/api/tests
export const addTest: RequestHandler = catchAsync( async (req, res, next) => {

	console.log('add', req.body)

	const test = await Test.create(req.body)
	// const test = req.body
	if(!test) return next(appError('no test document found'))

	res.status(201).json({
		status: 'success',
		data: test
	})
})

// PATCH 	/api/tests/:testId
export const updateTest: RequestHandler = catchAsync( async (req, res, next) => {
	const { testId = ''} = req.params

	const test = await Test.findByIdAndUpdate(testId, req.body, { new: true })
	if(!test) return next(appError('no test document update failed'))

	res.status(201).json({
		status: 'success',
		data: test
	})
})

// DELETE 	/api/tests/:testId
export const deleteTest: RequestHandler = catchAsync( async (req, res, next) => {
	const { testId = ''} = req.params

	const test = await Test.findByIdAndDelete(testId)
	if(!test) return next(appError('no test document deletation failed'))

	res.status(204).json({
		status: 'success',
		data: test
	})
})



