import bcryptjs from 'bcryptjs'


type User = {
  _id: string
  name: string
  email: string
  password: string
  createdAt: string
  updatedAt: string
  __v: number
}

const users: User[] = [
  {
    "_id": "6649e58813d67e3b2f23f568",
    "name": "ayan hossain",
    "email": "ayan@gmail.com",
    "password": "asdf",
    "createdAt": "2024-05-19T11:42:00.075Z",
    "updatedAt": "2024-05-19T11:42:00.075Z",
    "__v": 0
  },
  {
    "_id": "6649e58813d67e3b2f23f568",
    "name": "ayan hossain",
    "email": "ayan@gmail.com",
    "password": "asdf",
    "createdAt": "2024-05-19T11:42:00.075Z",
    "updatedAt": "2024-05-19T11:42:00.075Z",
    "__v": 0
  },
]

Promise.all(users.map( async (user) => ({
	...user,
	password: await bcryptjs.hash( user.password, 10 ),
	createdAt: Date.now()
})))
.then( modifiedUsers => {
	console.log( modifiedUsers )
})



