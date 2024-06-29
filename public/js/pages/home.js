import { $, showError, redirectTo, } from '/js/module/utils.js'

const button = $('[name=logout]')
button.addEventListener('click', async (evt) => {
	evt.preventDefault()

	try {
		const res = await fetch('/api/auth/logout', { method: 'POST' })
		//- if(!res.ok) throw new Error('logout filed')
		if(!res.ok) throw await res.json()

		const data = await res.json()
		console.log(data)
		redirectTo('/login')

	} catch (err) {
		showError(err.message)
		console.log(err)
	}
})



const showUsersInUI = (data) => {
	const usersContainer = $('[name=users-container]')
	const pre = document.createElement('pre')
	pre.textContent = JSON.stringify(data, null, 2)

	usersContainer.appendChild(pre)

}

const getAllUsers = async () => {
	try {
		const res = await fetch('/api/users', { method: 'GET',  })
		if(!res.ok) throw await res.json()

		const data = await res.json()
		showUsersInUI(data)

		
	} catch (err) {
		showError(err.message)
		console.log(err)
	}
}

getAllUsers()
