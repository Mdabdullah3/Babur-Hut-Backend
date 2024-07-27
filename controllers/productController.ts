import type { RequestHandler } from 'express'
import type { ProductDocument, Image} from '../types/product'
// import type { LogedInUser } from '../types/user'
import Product from '../models/productModel'
import User from '../models/userModel'
// import crypto from 'crypto'
import { appError, catchAsync } from './errorController'
import { apiFeatures, generateSequentialCustomId, getDataUrlSize } from '../utils'
import { isValidObjectId } from 'mongoose'
import * as productDto from '../dtos/productDto'
import * as fileService from '../services/fileService'
import { promisify } from 'node:util'

// type ResponseType<T> = {
// 	status: 'success' | 'failed' | 'error'
// 	data: T 
// }


// => GET 	/api/products/get-random-products
export const gerRandomProducts:RequestHandler = catchAsync(async (_req, res, _next) => {
	const products = await Product.aggregate().sample(1)
	res.json({
		status: 'success',
		total: products.length,
		data: products,
	})
})

// => GET /api/products
export const getAllProducts:RequestHandler = catchAsync( async (req, res, _next) => {
	// const products = await Product.find<ProductDocument>()
	const userId = req.params.userId
	// const productId = req.params.productId

	let filter = {}
	// if(productId) filter = { product: productId.toString() } 
	if(userId) filter = { user: userId.toString() } 

	const products:ProductDocument[] = await apiFeatures(Product, req.query, filter)

	res.json({
		status: 'success',
		total: products.length,
		data: products,
	})
})

/* => POST /api/products
req.body = {
	"user": logedInUser.productId,
	"name": "it is my sample product (delete)",
	"price": 500,
	"quantity": 5,
	"summary": "summary description between 10-150",
	"description": "description between 10-1000",

	"category": "pant",
	"brand": "niki",
	"size": "xs",

	"coverPhoto": "data:jpg/images;alkjdfajd...=",
	"images": [
		"data:jpg/images;alkjdfajd...=",
		"data:jpg/images;rraksdjfasdkjf...=",
		"data:jpg/images;fflkjdfajd...=",
	],

	# base64 dataUrl
	"video": "data:jpg/images;alkjdfajd...=",

	or 

	# link url
	"video": "http://youtube.com/video-url",


}
*/
export const addProduct:RequestHandler = catchAsync(async (req, res, next) => {

	try {
		//--- Custom product Id
		const currentDocuments = await Product.countDocuments()
		const	customId = generateSequentialCustomId({ 
			categoryName: 'product', 
			countDocuments: currentDocuments
		})
		req.body.customId = customId


		//--- handle body
		if(!req.body.coverPhoto) return next(appError('coverPhoto field required'))
		if(!req.body.images?.length) return next(appError('you must pass images of array'))
		if(req.body.images.length > 3 ) return next(appError('only allow upto 3 images'))


		// handle video upload
		if(req.body.video) {
			if(typeof req.body.video !== 'string') return next(appError('video must be url or base64 dataUrl'))

			if(req.body.video.startsWith('http')) {
				req.body.video = {
					public_id: crypto.randomUUID(),
					secure_url: req.body.video
				} 
			} else if(req.body.video.startsWith('data:')) {
				const imageSize = getDataUrlSize(req.body.video)
				const maxImageSize = 1024 * 1024 * 200 			// => 200 MB
				if(imageSize > maxImageSize) return next(appError('You cross the max image size: 200MB(max)'))

				const { error: avatarError, image: video } = await fileService.handleBase64File(req.body.video, '/products')
				if(avatarError || !video) return next(appError(avatarError))
				req.body.video = video
				

			} else {
				const videoErrorMessage = 'req.body.video must have url or base64 bit dataUrl'
				return next(appError(videoErrorMessage))
			}


			// if videoType not url or not file
			// return next(appError(videoErrorMessage))

		} else {
			req.body.video = undefined 		// if video empty then just remove
		}



		const imageSize = getDataUrlSize(req.body.coverPhoto)
		const maxImageSize = 1024 * 1024 * 5 			// => 5 MB
		if(imageSize > maxImageSize) return next(appError('You cross the max image size: 5MB(max)'))

		const { error: avatarError, image: coverPhoto } = await fileService.handleBase64File(req.body.coverPhoto, '/products')
		if(avatarError || !coverPhoto) return next(appError(avatarError))
		req.body.coverPhoto = coverPhoto

		const images = req.body.images.map( async (dataUrl: string) => {
			// Check image size
			const imageSize = getDataUrlSize(dataUrl)
			const maxImageSize = 1024 * 1024 * 5 			// => 5 MB
			if(imageSize > maxImageSize) return next(appError('You cross the max image size: 5MB(max)'))

			// save image into disk
			const { error:imageError, image } = await fileService.handleBase64File(dataUrl, '/products')
			if(imageError || !image) throw new Error(imageError) 

			return image
		})
		req.body.images = await Promise.all( images )

		const product = await Product.create(req.body)
		if(!product) return next(appError('product not found'))

		// console.log(product)
		
		res.json({
			status: 'success',
			data: product
		})

	} catch (err) {
		// console.log(err)
		setTimeout(() => {
			promisify(fileService.removeFile)(req.body.coverPhoto?.secure_url)
		}, 1000)

		setTimeout(() => {
			req.body.images.forEach( (image: Image) => {
				promisify(fileService.removeFile)(image?.secure_url)
			})
		}, 1000)

		setTimeout(() => {
			if( !req.body.video?.secure_url.startsWith('http') ) {
				promisify(fileService.removeFile)(req.body.video.secure_url)
			}
		}, 1000)

		if(err instanceof Error) next(appError(err.message))
		if(typeof err === 'string') next(appError(err))
	}
})

// export const addProduct:RequestHandler = catchAsync(async (req, res, next) => {
// 	res.json({ body: req.body })
// })

// => GET /api/products/:productId
export const getProductByIdOrSlug:RequestHandler = catchAsync(async (req, res, next) => {
	const productId = req.params.productId

	const filter = (isValidObjectId(productId)) ?  { _id: productId } : { slug: productId }
	const products = await apiFeatures(Product, req.query, filter).limit(1)
	if(!products.length) return next(appError('product not found'))
	
	res.status(200).json({
		status: 'success',
		data: products[0]
	})
})

/* => PATCH /api/products/:productId
const allowedFields = [
	'name',
	'price',
	'summary',
	'description',
	'category',
	'brand',
	'size',
	'quantity',
	'coverPhoto',
	'images',
]
req.body = {
	... addProduct
}
*/
export const updateProductByIdOrSlug:RequestHandler = async (req, res, next) => {
	const productId = req.params.productId

	try {
		if(req.body.coverPhoto) {
			// check file size
			const imageSize = getDataUrlSize(req.body.coverPhoto)
			const maxImageSize = 1024 * 1024 * 5 			// => 5 MB
			if(imageSize > maxImageSize) return next(appError('You cross the max image size: 5MB(max)'))

			// upload file and return { error, image: { public_i, secure_url }}
			const { error: _avatarError, image: coverPhoto } = await fileService.handleBase64File(req.body.coverPhoto, '/products')
			// if(avatarError || !coverPhoto) return next(appError(avatarError))

			if(coverPhoto) req.body.coverPhoto = coverPhoto
		}

		if(req.body.images?.length) {
			const images = req.body.images.map( async (dataUrl: string) => {
				// Check image size
				const imageSize = getDataUrlSize(dataUrl)
				const maxImageSize = 1024 * 1024 * 5 			// => 5 MB
				if(imageSize > maxImageSize) return next(appError('You cross the max image size: 5MB(max)'))

				// save image into disk
				const { error: _imageError, image } = await fileService.handleBase64File(dataUrl, '/products')
				// if(imageError || !image) throw new Error(imageError) 

				if(image) return image
			})
			req.body.images = await Promise.all( images )
		}

		const filteredBody = productDto.filterBodyForUpdateProduct(req.body)

		const filter = (isValidObjectId(productId)) ?  { _id: productId } : { slug: productId }

		const product = await Product.findOne(filter )
		if(!product) return next(appError('product not found'))
		
		const updatedProduct = await Product.findOne(filter, filteredBody, { new: true })
		if(!updatedProduct) return next(appError('product not found'))
		
		// delete old images
		setTimeout(() => {
			if(req.body.coverPhoto && product.coverPhoto?.secure_url) {
				setTimeout(() => {
					promisify(fileService.removeFile)(product.coverPhoto.secure_url)
				}, 1000);
			}

			if(req.body.images && product.images?.length) {
				product.images.forEach( (image: Image) => {
					setTimeout(() => {
						promisify(fileService.removeFile)(image.secure_url)
					}, 1000);
				})
			}
		}, 1000)


		res.status(201).json({
			status: 'success',
			data: updatedProduct
		})

	} catch (error) {
		setTimeout(() => {
			if(req.body.coverPhoto?.secure_url) {
				setTimeout(() => {
					promisify(fileService.removeFile)(req.body.coverPhoto.secure_url)
				}, 1000);
			}

			if(req.body.images?.length) {
				req.body.images.forEach( (image: Image) => {
					setTimeout(() => {
						promisify(fileService.removeFile)(image.secure_url)
					}, 1000);
				})
			}
		}, 1000);

		if(error instanceof Error) next(appError(error.message))
		if(typeof error === 'string') next(appError(error))
	}
}

// => DELETE /api/products/:productId
export const deleteProductByIdOrSlug:RequestHandler = catchAsync(async (req, res, next) => {
	const productId = req.params.productId

	const filter = (isValidObjectId(productId)) ?  { _id: productId } : { slug: productId }
	const product = await Product.findOneAndDelete(filter)
	if(!product) return next(appError('product not found'))
	

	if(product.coverPhoto) {
		promisify(fileService.removeFile)(product.coverPhoto.secure_url)
	}
	if(product.images.length) {
		product.images.forEach( image => {
			promisify(fileService.removeFile)(image.secure_url)
		})
	}
	if(product.video && !product.video.secure_url.startsWith('http')) {
		promisify(fileService.removeFile)(product.video.secure_url)
	}
	// // delete old images
	// setTimeout(() => {
	// 	if(product.coverPhoto?.secure_url) {
	// 		promisify(fileService.removeFile)(product.coverPhoto.secure_url)
	// 	}

	// 	if(product.images?.length) {
	// 		product.images.forEach( (image: Image) => {
	// 			promisify(fileService.removeFile)(image.secure_url)
	// 		})
	// 	}
	// }, 1000)


	// deleting productId from user.likes = [ ...productIds ]
	await User.findByIdAndUpdate(product.user, { "$pull": { likes: productId }}, { new: true, }) 	

	res.status(204).json({
		status: 'success',
		data: product
	})
})




// GET /api/products/:productId/like
export const updateProductLike = catchAsync(async (req, res, next) => {
	const productId = req.params.productId
	// const user = req.user as LogedInUser & { likes: string[]}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const user = req.user as any
	const userId = user._id

	if(!productId) return next(appError('productId is required'))



	const isLiked = user.likes?.includes(productId)

	const operator = isLiked ? '$pull' : '$addToSet'
	const updatedUser = await User.findByIdAndUpdate(userId, { [operator]: { likes: productId }}, { new: true, }) 	
	const updatedProduct = await Product.findByIdAndUpdate(productId, { [operator]: { likes: userId }}, { new: true, }) 	

	if(updatedUser) req.user = updatedUser

	// if( !isLiked ) { 														// Show notification only when liked, skip unlike senerio
	// 	const notification = await Notification.insertNotification({
	// 		entityId: updatedTweet._id, 						// on which notification user liked ?
	// 		userFrom: userId, 											// Who liked it ?
	// 		userTo: updatedTweet.user._id, 					// which user create this tweet ?
	// 		type: 'like', 													// ['like', 'retweet', 'replyTo', 'follow']
	// 		kind: 'tweet', 													// ['tweet', 'message' ]
	// 	})

	// 	if(!notification) return next(appError('Notification failed'))
	// }

	res.status(201).json({
		status: 'success',
		data: updatedProduct
	})
})

