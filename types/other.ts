import { Types, Document } from 'mongoose'

type Image = {
	public_id: string
	secure_url: string
}

export type OtherDocument = Document & {
	user: Types.ObjectId,
	image: Image
}

export type UpdateOther = {
	user: Types.ObjectId,
	image: Image
}
