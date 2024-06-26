
export const getProducts = async () => {
	try {
		const res = await fetch('/api/products', {
			headers: {
				'Content-type': 'application/json',
				'Accept': 'application/json',
			}
		})

		if(!res.ok) throw await res.json()

		return await res.json()

	} catch (error) {
		return error
	}
}



/* => POST /api/products
body: {
	"user": logedInUser.id,
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
	]
}
*/
export const addProduct = async (fields) => {
	try {
		const res = await fetch('/api/products', {
			method: 'POST',
			body: JSON.stringify(fields),
			headers: {
				'Content-type': 'application/json',
				'Accept': 'application/json',
			}
		})

		if(!res.ok) throw await res.json()

		return await res.json()

	} catch (error) {
		return error
	}
}


export const getProductByIdOrSlug = async (idOrSlug) => {
	try {
		const res = await fetch(`/api/products/${idOrSlug}`, {
			headers: {
				'Content-type': 'application/json',
				'Accept': 'application/json',
			}
		})

		if(!res.ok) throw await res.json()

		return await res.json()

	} catch (error) {
		return error
	}
}

/* => PATCH /api/products/:id-or-slug
body: {
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
	]
}
*/
export const updateProductByIdOrSlug = async (idOrSlug, body={}) => {
	try {
		const res = await fetch(`/api/products/${idOrSlug}`, {
			method: 'PATCH',
			body: JSON.stringify(body),
			headers: {
				'Content-type': 'application/json',
				'Accept': 'application/json',
			}
		})

		if(!res.ok) throw await res.json()

		return await res.json()

	} catch (error) {
		return error
	}
}

// => DELETE /api/products/:id
export const deleteProductByIdOrSlug = async (idOrSlug) => {
	try {
		const res = await fetch(`/api/products/${idOrSlug}`, {
			method: 'DELETE',
			headers: {
				'Content-type': 'application/json',
				'Accept': 'application/json',
			}
		})

		if(!res.ok) throw await res.json()

		return { status: 'success' }

	} catch (error) {
		return error
	}
}