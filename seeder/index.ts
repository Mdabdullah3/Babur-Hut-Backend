import { products } from './products'
import { users } from './users'
import { reviews } from './reviews'

import { dbConnect } from '../models/dbConnect'
import Product from '../models/productModel'
import User from '../models/userModel'
import Review from '../models/reviewModel'




// ts-node seeder/index.ts 	--import
const importHandler = async () => {
	try {
		await dbConnect()

		await User.deleteMany()
		await User.create(users)

		await Product.deleteMany()
		await Product.create(products)

		await Review.deleteMany()
		await Review.create(reviews)

		console.log('data imported Successfully')
		process.exit(0)

	} catch (err) {
		console.log(err)
		process.exit(1)
	}
}

// ts-node seeder/index.ts 	--delete
const deleteHandler = async () => {
	try {
		await dbConnect()

		await User.deleteMany()
		await Product.deleteMany()
		await Review.deleteMany()
		console.log('data deleted Successfully')
		process.exit(0)

	} catch (err) {
		console.log(err)
		process.exit(1)
	}
}

// ts-node seeder/index.ts 
const readHandler = async () => {
	try {
		await dbConnect()

		const products = await Product.find()
		const users = await User.find()
		console.log({ products, users })
		process.exit(0)

	} catch (err) {
		console.log(err)
		process.exit(1)
	}
}

const args = process.argv[2]
if(args === '--import') importHandler()
if(args === '--delete') deleteHandler()
else readHandler()