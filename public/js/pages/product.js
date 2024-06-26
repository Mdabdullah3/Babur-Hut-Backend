import { getProducts } from '/js/api/product.js'
import { $ } from '/js/module/utils.js'

const showProducts = $('[name=show-products]')

const updateProductsUI = async () => {
	const { data: products } = await getProducts()

	// showProducts.textContent = JSON.stringify(products, null, 2)
	const ul = document.createElement('ul')

	products.forEach( product => {
		const li = document.createElement('li')
		const a = document.createElement('a')

		a.href = `/product/${product.slug}`
		a.textContent = product.name

		li.appendChild(a)
		ul.appendChild(li)
	})

	showProducts.appendChild(ul)
}
addEventListener('DOMContentLoaded', async () => {
	updateProductsUI()
})
