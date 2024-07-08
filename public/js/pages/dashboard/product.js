import { 
	getProducts, 
	addProduct, 
	getProductByIdOrSlug, 
	updateProductByIdOrSlug,
	deleteProductByIdOrSlug
} from '/js/api/product.js'
import { $, readAsDataURL, showError, showSuccess } from '/js/module/utils.js'

/* Global Variable:
		. logedInUser
*/

/*
{
	"user": logedInUser.id,
	"name": "it is my sample product (delete)",
	"price": 500,
	"quantity": 5,
	"summary": "summary description between 10-150",
	"description": "description between 10-1000",

	"category": "pant",
	"brand": "niki",
	"size": "xs",

	"coverPhoto": "data:jpg/images;alkjdfajd=",
	"images": [
		"data:jpg/images;alkjdfajd=",
		"data:jpg/images;rraksdjfasdkjf=",
		"data:jpg/images;fflkjdfajd=",
	]
}
*/

const showProducts = $('[name=show-products]')
const showProductsInDetails = $('[name=show-products-in-details]')
const addProductContainer = $('[name=add-product-container]')
const addProductForm = $('[name=add-product]')
const addProductLink = $('[name=add-product-link]')

const productIdContainer = addProductContainer.querySelector('[name=product-id-container]')
const productIdValue = addProductContainer.querySelector('[name=product-id-value]')
const productTitle = addProductContainer.querySelector('[name=product-title]')
const productName = addProductContainer.querySelector('[name=name]')
const productPrice = addProductContainer.querySelector('[name=price]')
const productQuantity = addProductContainer.querySelector('[name=quantity]')
const productSummary = addProductContainer.querySelector('[name=summary]')
const productDescription = addProductContainer.querySelector('[name=description]')
const submitButton = addProductContainer.querySelector('button[type=submit]')




const updateProductsUI = async () => {
	try {
		const { data: products } = await getProducts()

		const ul = document.createElement('ul')
		products.forEach( product => {
			const li = document.createElement('li')
			const a = document.createElement('a')

			a.href = `/product/${product.slug}`
			a.textContent = `${product.name} | ${product.price} | ${product.quantity} `

			const updateButton = document.createElement('button')
			updateButton.id = product._id
			updateButton.name = 'update'
			updateButton.textContent = 'Update'

			const deleteButton = document.createElement('button')
			deleteButton.id = product._id
			deleteButton.name = 'delete'
			deleteButton.textContent = 'Delete'

			li.appendChild(a)
			li.appendChild(updateButton)
			li.appendChild(deleteButton)

			ul.appendChild(li)
		})

		showProducts.appendChild(ul)

		showProductsInDetails.textContent = JSON.stringify(products, null, 2)
		
	} catch (error) {
		showError(error.message)
	}
}
addEventListener('DOMContentLoaded', async () => {
	updateProductsUI()
})



// toggle add-product from: => show/hide
addProductLink.addEventListener('click', async () => {
	if(addProductContainer.classList.contains('active') ) {
		addProductContainer.classList.remove('active')
		addProductContainer.style.display = 'none'
	} else {
		addProductContainer.classList.add('active')
		addProductContainer.style.display = 'block'
	}
})




// POST /api/products
addProductForm.addEventListener('submit', async (evt) => {
	evt.preventDefault()

	const formData = new FormData(evt.target)
	const fields = Object.fromEntries( formData )


	try {
		// console.log(fields)
		if(fields.coverPhoto) fields.coverPhoto = await readAsDataURL(fields.coverPhoto)


		if(fields.video instanceof File) {
			try {
				fields.video = await readAsDataURL(fields.video, { type: 'file' })
			} catch (err) {
				console.log(err)	
			}
		} 
			// console.log(fields.video)
		
		const imageFiles = $('[name=images]').files
		const images = [...imageFiles].map( async (image) => await readAsDataURL(image))
		fields.images = await Promise.all(images)

		// eslint-disable-next-line no-undef
		fields.user = logedInUser._id

		const data = await addProduct(fields)
		console.log(data)

		// console.log(fields)
		updateProductsUI()
		showSuccess('product added successfully')


	} catch (err) {
		if(err.message) return showError(err)

		console.log(err)
	}
})


/*
	PATCH /api/products/:id
	DELETE /api/products/:id */
showProducts.addEventListener('click', (evt) => {
	if(evt.target.tagName !== 'BUTTON') return
	// console.log(evt.target.name)

	// PATCH /api/products/:id
	if(evt.target.name === 'update') {
		const productId = evt.target.id
		if(!productId) return console.log('update button: productId: ', evt.target.id)
		updateProductHandler(productId)
	}

	// DELETE /api/products/:id
	if(evt.target.name === 'delete') {
		const productId = evt.target.id
		if(!productId) return console.log('delete button: productId: ', evt.target.id)
		deleteProductHandler(productId)
	}
})


const updateProductHandler = async (productId) => {
	try {
		const { data: product } = await getProductByIdOrSlug(productId)

		productIdContainer.style.display = 'block'
		productIdValue.textContent = productId

		productTitle.textContent = 'Update Product'
		submitButton.textContent = 'Update Product'
		productName.value = product.name
		productPrice.value = product.price
		productQuantity.value = product.quantity
		productSummary.value = product.summary
		productDescription.value = product.description

		// prevent default form-submit: which is add prodcut handler
		submitButton.addEventListener('click', async (evt) => {
			evt.preventDefault()
			console.log('update handler')

			const addProductForm = addProductContainer.querySelector('form[name=add-product]')

			const formData = new FormData(addProductForm)
			const fields = Object.fromEntries( formData )

			if(fields.coverPhoto) fields.coverPhoto = await readAsDataURL(fields.coverPhoto)
			
			const imageFiles = $('[name=images]').files
			const images = [...imageFiles].map( async (image) => await readAsDataURL(image))
			fields.images = await Promise.all(images)

			// eslint-disable-next-line no-undef
			fields.user = logedInUser._id

			const { message, data } = await updateProductByIdOrSlug(productId, fields)
			if(message) throw new Error(message)
			console.log(data)
			// console.log(fields)

			// re-fetch products
			updateProductsUI()

			// reset-to-default
			productIdContainer.style.display = 'none'
			productTitle.textContent = 'Add Product'
			submitButton.textContent = 'Add Product'

		})

	} catch (error) {
		console.log('Error: => ', error)	
	}


}
const deleteProductHandler = async (productId) => {
	console.log({ productId })

	try {
		const { message } = await deleteProductByIdOrSlug(productId)
		if(message) throw new Error(message)

	} catch (error) {
		console.log(error)
		
	}
}