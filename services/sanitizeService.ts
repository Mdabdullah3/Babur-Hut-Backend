/* eslint-disable @typescript-eslint/no-explicit-any */
import sanitizeHtml from 'sanitize-html';
import { Schema } from 'mongoose';

const sanitizeObject = (obj: any): void  => {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {

      obj[key] = sanitizeHtml(obj[key], {
        allowedTags: [], 					// Remove all HTML tags
        allowedAttributes: {}, 		// Remove all HTML attributes
      }).trim();

    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeObject(obj[key]);
    }
  }
}

export const sanitizeSchema = (schema: Schema): void => {
  schema.pre('save', function (next) {
    sanitizeObject(this._doc);  // `this._doc` is the raw document object
    next();
  });
}

// export default sanitizeSchema;

