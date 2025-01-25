import { Types, Document } from 'mongoose'

export type BillingAddressDocument = Document & {

	user: Types.ObjectId
  name: string
  phone: string
  street: string
  city: string
  state: string
  postcode: string
  country: string
  date: Date
  selectedAddress: boolean

}


export type UpdateBillingAddress = {

     name: string
     phone: string
     street: string
     city: string
     state: string
     postcode: string
     country: string
     date: Date
     selectedAddress: boolean
}
