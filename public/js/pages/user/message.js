// import { showError, redirectTo, } from '/js/module/utils.js'

// eslint-disable-next-line no-undef
const socket = io('http://localhost:5000/')
// eslint-disable-next-line no-undef
const userId = logedInUser._id

let socketIo = undefined
let isConnected = false

// just ignore eslint warning
socketIo
isConnected


socket.on('connect', () => {
	socketIo = socket
	socket.emit('user-join', { socketId: socket.id, userId })
})
socket.on('user-join', ({ connected }) => {
	isConnected = connected
	
	// console.log({ userId, socketId: socketIo.id, connected })
})

// show error in UI, instead of log
socket.on('error', ({ message }) => {
	console.log({ message })
})




// Send Message
const form = document.querySelector('[name=message-form]')
const messageInput = document.querySelector('[name=message]')
const messageContainer = document.querySelector('[name=message-container]')

form.addEventListener('submit', async (evt) => {
	evt.preventDefault()

	socket.emit('message', { 
		message: messageInput.value,
		sender: 'userId'
	}) 
})



// Receive Message
socket.on('message', ({ message }) => {
	// console.log(message)
	showMessageInUI(message)
})


const showMessageInUI = (message) => {
	const li = document.createElement('li')
	li.textContent = message
	messageContainer.insertAdjacentElement('beforebegin', li)

	messageInput.value = '' 	// empty message
}