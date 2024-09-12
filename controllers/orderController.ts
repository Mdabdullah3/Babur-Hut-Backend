import type { RequestHandler } from 'express';
import type { LogedInUser } from '../types/user'
import { appError, catchAsync } from './errorController';
import { apiFeatures } from '../utils';
import Order from '../models/orderModel';


// GET 	/api/orders
// GET /api/users/:userId/orders
// GET /api/users/me/orders
export const getOrders: RequestHandler = catchAsync( async (req, res, _next) => {
	const logedInUser = req.user as LogedInUser

	let filter = {}
	const userId = req.params.userId === 'me' ? logedInUser._id : req.params.userId
	if(userId) filter = { user: userId.toString() } 

	const orders = await apiFeatures(Order, req.query, filter)
	const total = await Order.countDocuments()

	res.json({
		status: 'success',
		total,
		data: orders
	})
})



// GET 	/api/orders/:orderId
export const getOrderById: RequestHandler = catchAsync( async (req, res, next) => {
	const { orderId = ''} = req.params

	const order = await Order.findById(orderId)
	if(!order) return next(appError('no order document found'))

	res.status(200).json({
		status: 'success',
		data: order
	})
})

// => POST /api/orders/meny
export const getOrdersByIds:RequestHandler = catchAsync( async (req, res, _next) => {
	const orderIds = req.body.orderIds || []
	const orders = await Order.find({_id: { $in: orderIds }})

	res.json({
		status: 'success',
		total: orders.length,
		data: orders,
	})
})

// POST 	/api/orders
export const createOrder: RequestHandler = catchAsync( async (req, res, next) => {
	const order = await Order.create(req.body)
	if(!order) return next(appError('order create failed'))

	res.status(200).json({
		status: 'success',
		data: order
	})
})

// PATCH 	/api/orders/:orderId
export const updateOrder: RequestHandler = catchAsync( async (req, res, next) => {
	const { orderId = ''} = req.params

	const body = {
		status: req.body.status
	}

	const updatedOther = await Order.findByIdAndUpdate(orderId, body, { new: true })
	if(!updatedOther) return next(appError('no order document update failed'))

	res.status(201).json({
		status: 'success',
		data: updatedOther
	})
})

// DELETE 	/api/orders/:orderId
export const deleteOrder: RequestHandler = catchAsync( async (req, res, next) => {
	const { orderId = ''} = req.params

	const order = await Order.findByIdAndDelete(orderId)
	if(!order) return next(appError('no order document deletation failed'))

	res.status(204).json({
		status: 'success',
		data: order
	})
})



