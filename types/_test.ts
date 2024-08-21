import type { Document, Types } from 'mongoose';

// Define the Product interface
// export interface IProduct {
// 	product: Types.ObjectId;
// 	price: number;
// 	quantity: number;
// }
export type IProduct = Document & {
	product: Types.ObjectId;
	price: number;
	quantity: number;
}

// Define the ShippingInfo interface
export interface IShippingInfo {
	name: string;
	email: string;
	phone: string;
	method: string;
	address1: string;
	address2?: string;
	city: string;
	state: string;
	postcode: number;
	country: string;
	deliveryFee: number;
}

// Define the Order interface extending Document
export interface IOrder extends Document {
	products: IProduct[];
	status: 'pending' | 'completed' | 'shipped' | 'cancelled';
	currency: string;
	paymentType: string;
	user: Types.ObjectId;
	shippingInfo: IShippingInfo;

  orderCost?: number;
  profit?: number;
  brand?: string;

}