import { Router } from 'express'
import * as notificationController from '../controllers/notificationController'

// => /api/notifications/
export const router = Router({ mergeParams: true })

router.route('/')
	.get(notificationController.getAllNotifications)

router.route('/:notificationId')
	.get(notificationController.getNotificationById)
	.delete(notificationController.deleteNotificationById)
