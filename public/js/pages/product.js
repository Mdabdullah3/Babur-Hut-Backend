import { getProducts } from '/js/api/product.js'
import { $ } from '/js/module/utils.js'

const showProducts = $('[name=show-products]')


const showProductsInUI = (data) => {
	const productsContainer = $('[name=products-container]')
	const pre = document.createElement('pre')
	pre.textContent = JSON.stringify(data, null, 2)

	productsContainer.appendChild(pre)

}

const updateProductsUI = async () => {
	const { data: products } = await getProducts()
	showProductsInUI(products)

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
