import { Router } from 'express'
import * as subCategoryController from '../controllers/subCategoryController'

// => /api/sub-categories/
export const router = Router({ mergeParams: true })

router.route('/')
	.get(subCategoryController.getAllSubCagegories)
	.post(subCategoryController.addSubCategory)

router.route('/:subCategoryId')
	.get(subCategoryController.getSubCategoryById)
	.patch(subCategoryController.updateSubCategoryById)
	.delete(subCategoryController.deleteSubCategoryById)
