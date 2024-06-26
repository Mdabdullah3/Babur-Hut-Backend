import { getProductByIdOrSlug } from '../api/product.js'
import { $ } from '../module/utils.js'

const showProducts = $('[name=show-products]')
const productIdOrSlug = location.pathname.split('/product/').pop()


const updateProductsUI = async () => {
	const { data: products } = await getProductByIdOrSlug(productIdOrSlug)

	showProducts.textContent = JSON.stringify(products, null, 2)
}
addEventListener('DOMContentLoaded', async () => {
	updateProductsUI()
})
