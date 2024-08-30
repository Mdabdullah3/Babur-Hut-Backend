import { Router } from 'express'
import * as orderController from '../controllers/orderController'

// => /api/orders
// => /api/users/:userId/orders
export const router = Router({ mergeParams: true })

router.post('/many', orderController.getOrdersByIds)

router.route('/')
	.get(orderController.getOrders)
	.post(orderController.createOrder)

router.route('/:orderId')
	.get(orderController.getOrderById)
	.patch(orderController.updateOrder)
	.delete(orderController.deleteOrder)
