import type { RequestHandler } from 'express';
import { appError, catchAsync } from './errorController';
import Finance from '../models/financeModel';
import { apiFeatures } from '../utils';


// GET 	/api/finances
export const getFinances: RequestHandler = catchAsync( async (req, res, _next) => {
	const finances = await apiFeatures( Finance, req.query, {} )
	const total = await Finance.countDocuments()

	res.status(200).json({
		status: 'success',
		total,
		count: finances.length,
		data: finances
	})
})

// GET 	/api/finances/:financeId
export const getFinanceById: RequestHandler = catchAsync( async (req, res, next) => {
	const { financeId = ''} = req.params

	const finance = await Finance.findById(financeId)
	if(!finance) return next(appError('no finance document found'))

	res.status(200).json({
		status: 'success',
		data: finance
	})
})

// POST 	/api/finances
export const addFinance: RequestHandler = catchAsync( async (req, res, next) => {
	const finance = await Finance.create(req.body)
	if(!finance) return next(appError('no finance document found'))

	res.status(201).json({
		status: 'success',
		data: finance
	})
})

// PATCH 	/api/finances/:financeId
export const updateFinance: RequestHandler = catchAsync( async (req, res, next) => {
	const { financeId = ''} = req.params

	const finance = await Finance.findByIdAndUpdate(financeId, req.body, { new: true })
	if(!finance) return next(appError('no finance document update failed'))

	res.status(201).json({
		status: 'success',
		data: finance
	})
})

// DELETE 	/api/finances/:financeId
export const deleteFinance: RequestHandler = catchAsync( async (req, res, next) => {
	const { financeId = ''} = req.params

	const finance = await Finance.findByIdAndDelete(financeId)
	if(!finance) return next(appError('no finance document deletation failed'))

	res.status(204).json({
		status: 'success',
		data: finance
	})
})



