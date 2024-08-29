import { Types, Document } from 'mongoose'

type Image = {
	public_id: string
	secure_url: string
}



export type OtherDocument = Document & {
	name: string
	banner: string
	user: Types.ObjectId,
	image: Image

	mobileBanner: Image
	popupImageMobile: Image
	logo: Image
	popupImage: Image
}

export type UpdateOther = {
	name: string
	banner: string
	user: Types.ObjectId,
	image: Image

	mobileBanner: Image
	popupImageMobile: Image
	logo: Image
	popupImage: Image
}
