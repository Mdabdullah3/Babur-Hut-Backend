import type { RequestHandler } from 'express'
import { appError, catchAsync } from './errorController'
import Notification from '../models/notificationModel'
import { Types } from 'mongoose'


// call notification on other controllers directly, to send notification
export const demo = async () => {
	const newNotification = await Notification.createNotification({
		type: 'new-review', 																					// ['new-review', 'follow', 'call']
		entryId: new Types.ObjectId('66911496ca3e9dbe71533baf'), 			// if new-review, that entryId => Review._id
		userFrom: new Types.ObjectId('66911496ca3e9dbe71533baf'), 		// Who liked it ?
		userTo: new Types.ObjectId('66911496ca3e9dbe71533baf'), 			// which user create this tweet ?
	});
	console.log(newNotification)
}



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

// DELETE /api/notifications/:notificationId 		
export const deleteNotificationById = catchAsync( async (req, res, next) => {
	const notificationId = req.params.notificationId

	const notification = await Notification.findByIdAndDelete(notificationId)
	if(!notification) return next(appError('user not found'))

	res.status(204).json({
		status: 'success',
		data: notification 	
	})
})


