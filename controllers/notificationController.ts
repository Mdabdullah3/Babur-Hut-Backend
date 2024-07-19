import type { RequestHandler } from 'express'
import { appError, catchAsync } from './errorController'
// import { generateSequentialCustomId } from '../utils'
// import { filterBodyForUpdateVoucher } from '../dtos/voucherDto'
import Notification from '../models/notificationModel'


// GET /api/notifications
export const getAllNotifications:RequestHandler = catchAsync( async (_req, res, _next) => {
	const filter = {}
	const notification = await Notification.find(filter)


	res.status(200).json({
		status: 'success',
		total: notification.length,
		data: notification
	})

})

// GET /api/notifications/:notificationId 		
export const getNotificationById = catchAsync( async (req, res, next) => {
	const notificationId = req.params.notificationId

	const notification = await Notification.findById(notificationId)
	if(!notification) return next(appError('user not found'))

	res.status(200).json({
		status: 'success',
		data: notification 	
	})
})


