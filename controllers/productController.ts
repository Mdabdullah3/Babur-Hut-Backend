import type { RequestHandler } from 'express'
import type { Image, ProductVariant } from '../types/product'
import Product from '../models/productModel'
import User from '../models/userModel'
import { appError, catchAsync } from './errorController'
import { apiFeatures, generateSequentialCustomId, getDataUrlSize } from '../utils'
import { isValidObjectId } from 'mongoose'
import * as productDto from '../dtos/productDto'
import * as fileService from '../services/fileService'
import { promisify } from 'node:util'
import mongoose from 'mongoose'


// type ResponseType<T> = {
// 	status: 'success' | 'failed' | 'error'
// 	data: T 
// }


// => GET 	/api/products/get-random-products?_limit=5
export const gerRandomProducts:RequestHandler = catchAsync(async (req, res, _next) => {
	const limit = Number(req.query._limit) || 5

	const products = await Product.aggregate().sample(limit)
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

	const products = await apiFeatures(Product, req.query, filter)
	const total = await Product.countDocuments()

	res.json({
		status: 'success',
		total,
		data: products,
	})
})


// => POST /api/products/meny
export const getlProductsByIds:RequestHandler = catchAsync( async (req, res, _next) => {

	const productIds = req.body.productIds || []
	const products = await Product.find({_id: { $in: productIds }})

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
		const	customId = generateSequentialCustomId({ categoryName: 'product' })
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
				const maxImageSize = 1024 * 1024 * 400 			// => 400 MB
				if(imageSize > maxImageSize) return next(appError('You cross the max image size: 400MB(max)'))

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


		// handle productVariants images
		if(req.body.productVariants?.length) {
			const variantImages = req.body.productVariants.map( async (productVariant: { image: string }) => {
				if(!productVariant.image) return productVariant 

				// Check image size
				const imageSize = getDataUrlSize(productVariant.image)
				const maxImageSize = 1024 * 1024 * 5 			// => 5 MB
				if(imageSize > maxImageSize) return next(appError('You cross the max image size: 5MB(max)'))

				// save image into disk
				const { error: _imageError, image } = await fileService.handleBase64File(productVariant.image, '/products')
				// if(imageError || !image) throw new Error(imageError) 

				return image ? { ...productVariant, image } : productVariant
			})
			req.body.productVariants = await Promise.all( variantImages )
		}



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

// Only update product
req.body = {
  "summary": "this is little summary so that identify product",
}

// update product + productVariants
req.body = {
  "summary": "this is little summary so that identify product",

  "productVariant": {
    "id": "66d62252d8e66708a18adb62",
			"name": "string update again clean update",
			"price": 444,
			"_id": "66d6055047aa51aed002a8cef",
			"size": "updated"
		}
}
*/
export const updateProductByIdOrSlug:RequestHandler = async (req, res, next) => {
	const productId = req.params.productId

	try {
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
				const maxImageSize = 1024 * 1024 * 400 			// => 400 MB
				if(imageSize > maxImageSize) return next(appError('You cross the max image size: 400MB(max)'))

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

		const { productVariant, ...restBody } = req.body
		let updatedProduct = null

		if(productVariant) {
			const { id:productVariantId, _id, ...restVariant } = req.body.productVariant

			// update productVariant.image
			if(productVariant.image) {
				const imageSize = getDataUrlSize(productVariant.image)
				const maxImageSize = 1024 * 1024 * 5 			// => 5 MB
				if(imageSize > maxImageSize) return next(appError('You cross the max image size: 5MB(max)'))

				// upload file and return { error, image: { public_i, secure_url }}
				const { error: _avatarError, image } = await fileService.handleBase64File(productVariant.image, '/products')
				// if(avatarError || !coverPhoto) return next(appError(avatarError))

				if(image) productVariant.image = image
			}

			updatedProduct = await createOrUpdateProductVariant ( productId, productVariantId, { ...restVariant, image: productVariant.image })
		}

		if(restBody) {
			const filter = (isValidObjectId(productId)) ?  { _id: productId } : { slug: productId }

			const product = await Product.findOne(filter )
			if(!product) return next(appError('product not found'))
		
			updatedProduct = await Product.findOneAndUpdate(filter, filteredBody, { new: true })
			if(!updatedProduct) return next(appError('product not found'))

			// delete old video
			if(req.body.video && !product.video?.secure_url?.startsWith('http')) {
				setTimeout(() => {
					promisify(fileService.removeFile)(product.video.secure_url)
				}, 1000);
			}

			// delete old images
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

		}

		res.status(201).json({
			status: 'success',
			data: updatedProduct
		})

	} catch (error) {
		// delete old video
		if(req.body.video?.secure_url && !req.body.video?.secure_url?.startsWith('http')) {
			setTimeout(() => {
				promisify(fileService.removeFile)(req.body.video.secure_url)
			}, 1000);
		}

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
// => DELETE /api/products/:productId?productVariantId='667ea9b1df5d6c0e864f1841'
export const deleteProductByIdOrSlug:RequestHandler = catchAsync(async (req, res, next) => {
	const productId = req.params.productId

	const productVariantId = req.query.productVariantId

	if(productVariantId) {
		if(typeof productVariantId !== 'string') return next(appError('productVariantId must be string'))
		await deleteProductVariantById(productId, productVariantId)

	} else {

		const filter = (isValidObjectId(productId)) ?  { _id: productId } : { slug: productId }
		const product = await Product.findOneAndDelete(filter)
		if(!product) return next(appError('product not found'))
		

		if(product?.coverPhoto?.secure_url) {
			setTimeout(() => {
				promisify(fileService.removeFile)(product.coverPhoto.secure_url)
			}, 1000);
		}
		if(product.images.length) {
			product.images.forEach( image => {
				if(image?.secure_url) {
					setTimeout(() => {
						promisify(fileService.removeFile)(image.secure_url)
					}, 1000);
				}
			})
		}
		if(product?.video?.secure_url && !product?.video?.secure_url?.startsWith('http')) {
			setTimeout(() => {
				promisify(fileService.removeFile)(product.video.secure_url)
			}, 1000);
		}

		// delete productVariants images
		if(req.body.productVariants?.length) {
			product.productVariants.forEach( productVariant => {
				if(productVariant.image?.secure_url) {
					setTimeout(() => {
						promisify(fileService.removeFile)(productVariant.image.secure_url)
					}, 1000);
				}
			})
		}



		// ---------
		// deleting productId from user.likes = [ ...productIds ]
		await User.findByIdAndUpdate(product.user, { "$pull": { likes: productId }}, { new: true, }) 	

	}

	res.status(204).json({
		status: 'success',
		// data: product
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



// Method-1: Update 	productVariant.name
// updateProductVariant('productObjectId', 'blue shirt', { price: 29.99, quantity: 10 });
// const updateProductVariant = async (productId: string, variantName: string, updatedData: Partial<ProductVariant>) => {
//   try {
//     const result = await Product.findOneAndUpdate(
//       { _id: productId, 'productVariants.name': variantName },  // Find product and specific variant
//       {
//         $set: {
//           'productVariants.$.name': updatedData.name,  
//           'productVariants.$.price': updatedData.price,  
//           'productVariants.$.discount': updatedData.discount,  
//           'productVariants.$.quantity': updatedData.quantity,
//           'productVariants.$.gender': updatedData.gender,
//           'productVariants.$.color': updatedData.color,
//           'productVariants.$.material': updatedData.material,
//           'productVariants.$.size': updatedData.size,
//           // 'productVariants.$.image': updatedData.image,
//         }
//       },
//       { new: true }  // Return the updated document
//     );
    
//     console.log('Updated Product:', result);
//   } catch (error) {
//     console.error('Error updating product variant:', error);
//   }
// }



// Method-2: Update 	productVariant._id
// updateProductVariantById('productObjectId', 'variantObjectId', { 
// 	price: '29.99', 
// 	quantity: '10', 
// 	color: 'red', 
// 	size: 'M' 
// });
// const updateProductVariantById = async (productId: string, variantId: string, updatedData: Partial<ProductVariant>) => {
//     const updatedProductVariant = await Product.findOneAndUpdate(
//       { _id: productId, 'productVariants._id': variantId },  // Find the product and the specific variant by its _id
//       {
//         $set: {
//           'productVariants.$[elem].name': updatedData.name,  
//           'productVariants.$[elem].price': updatedData.price,  // Update price
//           'productVariants.$[elem].quantity': updatedData.quantity,  // Update quantity
//           'productVariants.$[elem].color': updatedData.color,  // Update color
//           'productVariants.$[elem].size': updatedData.size,  // Update size

//           'productVariants.$[elem].discount': updatedData.discount,  
//           'productVariants.$[elem].gender': updatedData.gender,
//           'productVariants.$[elem].material': updatedData.material,
//         }
//       },
//       {
//         new: true,  				// Return the updated document
//         arrayFilters: [{ 'elem._id': variantId }]  // Use array filter to specify the element to update
//       }
//     );

// 		return updatedProductVariant

// }



const createOrUpdateProductVariant = async (
  productId: string,
  variantId: string | null,  // If null, create a new variant
  updatedData: Partial<ProductVariant>
) => {
	 

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const updateFields: any = {
		'productVariants.$[elem].name': updatedData.name,
		'productVariants.$[elem].price': updatedData.price,
		'productVariants.$[elem].quantity': updatedData.quantity,
		'productVariants.$[elem].color': updatedData.color,
		'productVariants.$[elem].size': updatedData.size,
		'productVariants.$[elem].discount': updatedData.discount,
		'productVariants.$[elem].gender': updatedData.gender,
		'productVariants.$[elem].material': updatedData.material,
	};

	// Conditionally add the image field if it's available and not undefined
	if (updatedData.image !== undefined) {
		updateFields['productVariants.$[elem].image'] = updatedData.image;
	}
	 
  // If `variantId` is provided, update the existing variant
  if (variantId) {

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId, 'productVariants._id': variantId },
      {
				$set: updateFields,
        // $set: {
        //   'productVariants.$[elem].name': updatedData.name,
        //   'productVariants.$[elem].price': updatedData.price,
        //   'productVariants.$[elem].quantity': updatedData.quantity,
        //   'productVariants.$[elem].color': updatedData.color,
        //   'productVariants.$[elem].size': updatedData.size,
        //   'productVariants.$[elem].discount': updatedData.discount,
        //   'productVariants.$[elem].gender': updatedData.gender,
        //   'productVariants.$[elem].material': updatedData.material,
        //   'productVariants.$[elem].image': updatedData.image,
        // },
      },
      {
        new: true, // Return the updated document
        arrayFilters: [{ 'elem._id': variantId }], // Use array filter to specify the element to update
      }
    );

		// delete old existing image
    const product = await Product.findById(productId)
		if(updatedData.image?.secure_url) {
			product?.productVariants.forEach( variant => {
				if( variant._id.toString() !== variantId ) return

				setTimeout(() => {
					promisify(fileService.removeFile)(variant.image.secure_url)
				}, 1000);
			})
		}

    return updatedProduct;

  } else {
    // If no `variantId` is provided, create a new variant
    const newVariantId = new mongoose.Types.ObjectId(); // Generate a new ObjectId for the variant

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId },
      {
        $push: {
          productVariants: {
            _id: newVariantId,
            // ...updatedData,
            ...updateFields,
          },
        },
      },
      {
        new: true, // Return the updated document after the addition
      }
    );

    return updatedProduct;
  }
};



// deleteProductVariantById('productObjectId', 'variantObjectId')
const deleteProductVariantById = async (productId: string, variantId: string) => {
	const updatedProduct = await Product.findOneAndUpdate(
		{ _id: productId },  
		{
			$pull: { 
				productVariants: { _id: variantId }  // Remove the product variant with the specified _id
			}
		},
		{ new: true }  // Return the updated document after the deletion
	);


	return updatedProduct;
};

