import app from './app'
import * as errorController from './controllers/errorController'

const PORT = 5000 					// used fixed port because we going to bind container fixed port host 
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
