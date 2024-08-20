import { CreateUser, UpdateUser, UserDocument } from '../types/user'
import { filterObjectByArray } from '../utils'

/* DTO = Data Transfer Object
	- To modify or alter any property of an object before send to client.

		- like do don't need all the property to send back to user, just need
				cupple of then so we need only send those only.

		- if we need to modify or alter any property name before send to client
				not modify in database level than can be done in DTO.

				doc = {
					_id,
					createdAt,
					updatedAt,
					_v,
					id
					...
				}

				dto = {
					_id,
					createdAt,
					id
					...
				}

*/


// POST : to create user
export const filterBodyForCreateUser = (body: CreateUser) => {
	const allowedFields = [
		'customId',
		'name',
		'email',
		'username',
		'password',
		'confirmPassword',
		'avatar',
		'coverPhoto',
		'phone',
		'gender',
		'location',
		'otherPermissions',

		'role',
		'isActive',
		'isVerified',

		'idCardFrontPageImage',
		'idCardBackPageImage',
		'idCardNumber',
		'bankStatementImage',
		'accountHolderName',
		'accountNumber',
		'routingNumber',
		'bankName',
		'bankBranch',
		'status',
	]

	return filterObjectByArray(body, allowedFields)
}

// user => user._doc
export const filterUserDocument = (user: UserDocument) => {
	const allowedFields = [
		'customId',
		'name',
		'email',
		// 'password',
		// 'confirmPassword',
		// 'latestMessage',
		'avatar',
		'role',
		'isActive',

		'id',
		'_id',
		'createdAt',
		'updatedAt',
	]
	return filterObjectByArray(user, allowedFields)
}


// PATCH : to update user._doc
export const filterBodyForUpdate = (body: UpdateUser) => {
	const allowedFields = [
		'name',
		'avatar', 								// need to delete old photo, so use seperate route
		'address',
		'gender',

		'email', 							// update seperate route to verify email
		'phone', 							// update seperate route to verify otp
		'role',

		'username',
		'password',
		'confirmPassword',
		'avatar',
		'coverPhoto',
		'gender',
		'location',
		'otherPermissions',

		'idCardFrontPageImage',
		'idCardBackPageImage',
		'idCardNumber',
		'bankStatementImage',
		'accountHolderName',
		'accountNumber',
		'routingNumber',
		'bankName',
		'bankBranch',
		'status',
	]
	return filterObjectByArray(body, allowedFields)
}

