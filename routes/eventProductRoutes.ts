import { Router } from 'express'
import * as eventProductController from '../controllers/eventProductsController'

// => /api/event-products/
export const router = Router({ mergeParams: true })

router.post('/many', eventProductController.getlEventProductsByIds)

router.route('/')
	.get(eventProductController.getEventProducts)
	.post(eventProductController.addEventProduct)

router.route('/:eventProductId')
	.get(eventProductController.getEventProductById)
	.patch(eventProductController.updateEventProduct)
	.delete(eventProductController.deleteEventProduct)
