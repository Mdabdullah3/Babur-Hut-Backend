import { Router } from 'express'
import * as _testController from '../controllers/_testController'

// => /api/test/
export const router = Router({ mergeParams: true })

router.route('/')
	.get(_testController.getTest)
	.post(_testController.addTest)

router.route('/:testId')
	.get(_testController.getTestById)
	.patch(_testController.updateTest)
	.delete(_testController.deleteTest)
