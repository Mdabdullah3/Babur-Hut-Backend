import { Types, Document } from 'mongoose'

type Image = {
	public_id: string
	secure_url: string
}

export type ReportDocument = Document & {
	user: Types.ObjectId,
	title: string
	message: string
	description: string
	image: Image
}

export type UpdateReport = {
	title: string
	message: string
	description: string
	image: Image
}
