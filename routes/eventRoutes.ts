import { Router } from 'express'
import * as eventController from '../controllers/eventController'

// => /api/others/
export const router = Router({ mergeParams: true })

router.route('/')
	.get(eventController.getEvents)
	.post(eventController.addEvent)

router.route('/:eventId')
	.get(eventController.getEventById)
	.patch(eventController.updateEvent)
	.delete(eventController.deleteEvent)
