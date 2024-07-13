import { Router } from 'express'
import * as categoryController from '../controllers/categoryController'

// => /api/categories/
export const router = Router({ mergeParams: true })

router.route('/')
	.get(categoryController.getAllCagegories)
	.post(categoryController.addCategory)

router.route('/:categoryId')
	.get(categoryController.getCategoryById)
	.patch(categoryController.updateCategoryById)
	.delete(categoryController.deleteCategoryById)
