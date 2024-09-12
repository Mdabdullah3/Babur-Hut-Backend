import type { RequestHandler } from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { appError } from './errorController'

import mimeType from 'mime-types'

// GET /upload/*
export const getUserFile: RequestHandler = (req, res, next) => {
	try {
		const file = path.join(process.cwd(), req.originalUrl)
		if (!fs.existsSync(file)) return next(appError('File does not exist'))

		// Get file stats for size and other metadata
		const stat = fs.statSync(file)
		const totalSize = stat.size

		const range = req.headers.range

		// If no range is provided by the client, serve the entire file
		if (!range) {
			res.status(200).header({
				'Content-Length': totalSize,
				'X-Total-Size': totalSize, 								// To set custom header for Content-Length
				'Content-Type': mimeType.lookup(file),
				'Accept-Ranges': 'bytes'
			})
			const readStream = fs.createReadStream(file)
			readStream.pipe(res)

			// Catch any errors that occur during streaming
			readStream.on('error', (err) => {
				return next(appError(`Error reading file: ${err.message}`))
			})

		} else {
			// If the range is provided, serve the requested chunk
			const parts = range.replace(/bytes=/, '').split('-')
			const start = parseInt(parts[0], 10)
			const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1
			const chunkSize = end - start + 1

			// Ensure the requested range is valid
			if (start >= totalSize || end >= totalSize) {
				return next(appError(`Requested range not satisfiable:`, 406))
				// return res.status(416).send('Requested range not satisfiable')
			}

			// Set headers for partial content
			res.status(206).header({
				'Content-Range': `bytes ${start}-${end}/${totalSize}`,
				'Accept-Ranges': 'bytes',
				'Content-Length': chunkSize,
				'X-Total-Size': totalSize, 								// To set custom header for Content-Length
				'Content-Type': mimeType.lookup(file),
			})

			// Create a stream for the requested range and pipe it to the response
			const readStream = fs.createReadStream(file, { start, end })
			readStream.pipe(res)

			// Handle stream errors gracefully
			readStream.on('error', (err) => {
				return next(appError(`Error reading file: ${err.message}`))
			})
		}
	} catch (err: unknown) {
		if (err instanceof Error) return next(appError(`Read uploaded file: ${err.message}`))
		if (typeof err === 'string') return next(appError(err))
		next(err)
	}
}
