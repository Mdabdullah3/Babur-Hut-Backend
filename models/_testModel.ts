import { Schema, model } from 'mongoose';
import { sanitizeSchema } from '../services/sanitizeService';

type Image = {
	public_url: string
	secure_url: string
}

type Test = {
	status: string
	currency: string
	image: Image[]
}


const testSchema = new Schema<Test>({
	status: {
			type: String,
	},
	currency: {
			type: String,
	},
	image: [{
		public_url: String,
		secure_url: String,
	}],
}, { timestamps: true });

testSchema.plugin(sanitizeSchema)

// testSchema.pre('save', (next) => {
// 	console.log(this)

// 	next()
// })

const Test = model<Test>('Test', testSchema);
export default Test;
