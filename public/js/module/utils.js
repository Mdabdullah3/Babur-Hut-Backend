import { Snackbar } from './components/index.js'

// const avatarEl = $('[name=avatar]')
export const $ = (selector) => document.querySelector(selector)
 
// redirectTo('/register')
export const redirectTo = (path, { base='' } = {}) => {
	const url = new URL( path, base || location.origin ) 		// get current url
	location.href = url.href 	
}

	
export const showError = (message, _reason) => {
	// console.log(message)
	Snackbar({
		severity: 'error',
		message,
		autoClose: true,
		closeTime: 3000
	})
}
export const showSuccess = (message, _reason) => {
	// console.log(message)
	Snackbar({
		severity: 'success',
		message,
		autoClose: true,
		closeTime: 3000
	})
}



// const dataUrl = await readAsDataURL(evt.target.files[0])
export const readAsDataURL = (file, { type='image' } = {}) => {
	return new Promise((resolve, reject) => {

		if(type === 'image') {
			const isImage = file?.type.match('image/*')
			if(!isImage) return reject(new Error('Please select an image') )
		}

		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.addEventListener('load', () => {
			if(reader.readyState === 2) {
				resolve(reader.result)
			}
		})
		reader.addEventListener('error', reject)
	})
}


// it prevent HTML XSS Attack
export const encodeHTML = (string) => string
	.replace(/&/g, '&amp;')
	.replace(/</g, '&lt;')
	.replace(/>/g, '&gt;')
	.replace(/"/g, '&quot;')
	.replace(/'/g, '&apos;')

export const decodeHTML = (string) => string
	.replace(/&amp;/g, '&')
	.replace(/&lt;/g, '<')
	.replace(/&gt;/g, '>')
	.replace(/&quot;/g, '"')
	.replace(/&apos;/g, "'")



// Convert '<p> hi </p>' 	=> .createElement('p').textContent = 'hi'
export const stringToElement = ( htmlString ) => {
	const parser = new DOMParser()
	const doc = parser.parseFromString( htmlString, 'text/html' )

	return doc.body.firstChild
}


