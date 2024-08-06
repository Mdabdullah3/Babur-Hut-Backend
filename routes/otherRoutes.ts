import { Router } from 'express'
import * as otherController from '../controllers/otherController'

// => /api/others/
export const router = Router({ mergeParams: true })

router.route('/')
	.get(otherController.getOthers)
	.post(otherController.addOther)

router.route('/:otherId')
	.get(otherController.getOtherById)
	.patch(otherController.updateOther)
	.delete(otherController.deleteOther)
