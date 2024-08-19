import { Router } from 'express'
import * as reportController from '../controllers/reportController'

// => /api/reports/
export const router = Router({ mergeParams: true })

router.route('/')
	.get(reportController.getReports)
	.post(reportController.addReport)

router.route('/:reportId')
	.get(reportController.getReportById)
	.patch(reportController.updateReport)
	.delete(reportController.deleteReport)
