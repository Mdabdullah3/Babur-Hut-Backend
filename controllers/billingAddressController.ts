import type { RequestHandler } from 'express'
import type { LogedInUser } from '../types/user'
import { appError, catchAsync } from './errorController'
import Billing from '../models/billingModel'
import { apiFeatures } from '../utils'




// GET 	/api/billing-addresses
export const getAllBillingAddresses:RequestHandler = catchAsync(async (req, res, _next) => {
	const logedInUser = req.user as LogedInUser
	const userId = req.params.userId === 'me' ? logedInUser._id : req.params.userId

	let filter = {}
	if(userId) filter = { user: userId.toString() } 

	const billings = await apiFeatures(Billing, req.query, filter)
	const total = await Billing.countDocuments()

	res.status(200).json({
		status: 'success',
		total,
    count: billings.length,
		data: billings,
	})
})

// POST 	/api/billing-addresses
export const addBillingAddress:RequestHandler = catchAsync(async (req, res, next) => {



	const billing = await Billing.create(req.body)
	if(!billing) return next(appError('billing create failed'))

	res.status(201).json({
		status: 'success',
		data: billing,
	})
})


// GET 	/api/billing-addresses/:billingId
export const getBillingAddressById:RequestHandler = catchAsync(async (req, res, next) => {
	const billingId = req.params.billingId

	const billing = await Billing.findById(billingId)
	if(!billing) return next(appError(`billing not found by id: ${billingId}`))

	res.status(200).json({
		status: 'success',
		data: billing,
	})
})


// PATCH 	/api/billing-addresses/:billingId
export const updateBillingAddress:RequestHandler = catchAsync(async (req, res, next) => {
	const billingId = req.params.billingId



	const billing = await Billing.findByIdAndUpdate(billingId, req.body, { new: true })
	if(!billing) return next(appError(`billing update failed`))

	res.status(201).json({
		status: 'success',
		data: billing,
	})
})

// DELETE 	/api/billing-addresses/:billingId
export const deleteBillingAddress:RequestHandler = catchAsync(async (req, res, next) => {
	const billingId = req.params.billingId

	const filteredBody = req.body

	const billing = await Billing.findByIdAndDelete(billingId, filteredBody)
	if(!billing) return next(appError('billing deletation failed'))

	res.status(204).json({
		status: 'success',
		data: billing,
	})
})
