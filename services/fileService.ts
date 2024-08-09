// const crypto = require('node:crypto')
import path from 'node:path'
import fsPromises from 'node:fs/promises'
import { appError } from '../controllers/errorController'
import fs from 'node:fs'
// const { Buffer } = require('node:buffer')
// const { appError } = require('../controllers/errorController');
// const Jimp = require('jimp')



/*---------------[ upload file ]----------------

// const { error, image } = await fileService.handleBase64File(req.body.avatar)
// if(error || !image) return next(appError(error))

// req.body.avatar = image
// const filteredBody = userDto.filterBodyForCreateUser(req.body)
*/

type Image = {
	public_id: string
	secure_url: string
}
type TempObj = {
	error: string
	image: Image | null
}

export const handleBase64File = async (dataUrl: string, subDir='/users', _fileType='image', _aspectRatio='video') => {
	const tempObj: TempObj = { error: 'dataUrl is empty', image: null }

	if(!dataUrl) return tempObj
	const baseDir = '/upload'
	


	try {
		// if( !dataUrl.startsWith('data') ) throw new Error(`'${dataUrl}' is not valid dataUrl`) 
		if( !dataUrl.startsWith('data') ) return { error: `'${dataUrl}' is not valid dataUrl`, image: null  }

		// Step-1: seperate metadata from base64 string dataUrl 
		const [ metadata, base64 ] = dataUrl.split(';base64,')
		const mimetype = metadata.split(':').pop()!
		const [ _type, ext] = mimetype.split('/')

		if( !ext ) return { error: `please upload image as base64 bit data url`, image: null  }

		// // Step-2: allow file: image(default), pdf, ...
		// if(type !== fileType) return { error: `file type: ${fileType} not valid file type` }

		const destination = path.join(process.cwd(), baseDir, subDir)
		await fsPromises.mkdir(destination, { recursive: true })

		// Step-3: Generate unique filename for file
		const filename = crypto.randomUUID() + '.' + ext
		// const filename = crypto.randomUUID() + '.png' 					// Jimp only support: jpej|png|gim|bmp|tiff
		const filePath = path.join(destination, filename)
		const buffer = Buffer.from(base64, 'base64')

		await fsPromises.writeFile(filePath, buffer) 				// Without resize

		// // Step-4: Resize image before save
		// if(fileType === 'image') {
		// 	const imageWidth = aspectRatio === 'video' ? '' : 150
		// 	const imageHeight = aspectRatio === 'video' ? '' : 150

		// 	const image = await Jimp.read(buffer)
		// 	image.resize(imageWidth, imageHeight).quality(80).write(filePath)

		// } else {
		// 	await fsPromises.writeFile(filePath, buffer) 				// Without resize
		// }

		return {
			error: '',
			image: {
				public_id: crypto.randomUUID(),
				secure_url: path.join(baseDir, subDir, filename),
			}
		}

	} catch (err) {
		if(err instanceof Error) throw appError(err.message)
		if(typeof err === 'string' ) throw appError(err)
		// if(err instanceof Error) return { error: err.message, image: null }
		// if(typeof err === 'string' ) return { error: err, image: null }
	}


	return { error: 'Unknown', image: null }
}







export const removeFile = (relativePath: string) => {
	if(typeof relativePath !== 'string') return appError(`file path must be string, but got '${relativePath}'`)

	const filePath = path.join( process.cwd(), relativePath )

	if( fs.existsSync(filePath) ) {
		fs.unlink(filePath, (err) => {
			if(err) return appError(err.message)
		})
	}
}

