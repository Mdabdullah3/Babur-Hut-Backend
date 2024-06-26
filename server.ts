import app from './app'
import * as errorController from './controllers/errorController'
import { dbConnect } from './models/dbConnect'

dbConnect()

const PORT = process.env.PORT || 5000
const server = app.listen(PORT, async () => {

	console.log(`server running on http://localhost:${PORT}`)
})


errorController.promiseErrorHandler(server) 	// put it bery end

// => Test synchronous error handler
// throw 'Test synchronous error handler'
// throw new Error('Test synchronous error handler')

// => Test Asynchronous Error handler 
// Promise.reject('Test Asynchronous Error handler')
// Promise.reject(new Error('Test Asynchronous Error handler'))
