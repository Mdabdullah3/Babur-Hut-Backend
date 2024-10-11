![dockarize-nodejs-application.png](https://github.com/JavaScriptForEverything/babur-hat/blob/main/public/images/dockarize-nodejs-application.png)


###### Method-1: (Regular) Project Setup
```
# make sure mongodb is running on (default) port 27017
$ sudo systemctl status mongod 	

$ yarn dev


$ yarn build
$ yarn start
```

###### Method-2: (Docker) Project Setup
```
# make sure docker and docker socket deamon running
$ sudo systemctl status docker docker.socket 	

$ docker compose build
$ docker compose up --detach
$ docker compose stop
$ docker compose start

$ docker compose config --services 	# => backend ...
$ docker compose logs --follow backend
```




## Document Section:

### Common 4 type of Error Handling
1. Nodejs Error
2. Express Error
3. MongoDB Error
4. JsonWebToken Error

#### Nodejs Error
- Handled Node.js has 2 type of error:
	- Synchronous Error (Globally):
		- **code**: *throw 'Test synchronous error handler'*
		- **code**: *throw new Error('Test synchronous error handler')*

	- ASynchronous Error (Globally)
		- **code**: *Promise.reject('Test Asynchronous Error handler')*
		- **code**: *Promise.reject(new Error('Test Asynchronous Error handler'))*
	



### Express Error
Express has it's own built-in Global Error handler
- Uses Express Global Error handler
- Handled Route NotFound error

### Database Error
Database has common 4 type of errors 
- DBConnection Error 									: handled
- Invalid Id Error 		(CastError)			: provide simple message instead of technical mesage
- Duplicate Error 		(11000) 				: 	" 			" ....
- Validation Error 	(ValidationError)	:  	" 			" ....


### Routes
- GET / 				(just for testing)
- GET /register 			(just for testing)
- GET /login 		 		(just for testing)
- GET /error 		 		(just for testing) 
- GET /logout 		 		: logout from local, google, ... 

- GET /api/auth/google 			: Google Login
- GET /api/auth/google/callback 	: Google Login success redirect to
- GET /api/auth/google/success 	        : Get authToken on google success login


- GET /api/auth/register 		: Local Register
- GET /api/auth/login 			: Local Login
- GET /api/auth/out 			: logout (local + google)
		
- POST 	/api/auth/update-email 		        : Send request to update email by new email 
- GET 	/api/auth/update-email/:resetToken 	: handle update email from google link click

- POST 	/api/auth/update-phone 		        : Send request to update phone by OTP
- PATCH /api/auth/update-phone 		        : Update phone number by OTP

- GET /api/users
- DELETE /api/users/:id

- GET /api/products
- POST /api/products

- GET /api/reviews
- POST /api/reviews


### Login and Registration
- We can login multiple ways:
	- Local Login: 
	- Google Login: 
	- OTP Login: 



##### For Local Register
` - POST 	`http://localhost:5000/api/auth/register'
`
```
const fields = {
	email: 'abc@gmail.com',
	password: 'yourpassword',
}

try {
	const res = await fetch('/api/auth/register', {
		method: 'POST',
		body: JSON.stringify(fields),
		headers: {
			'content-type': 'application/json',
			'accept': 'application/json',
		}
	})
	if( !res.ok ) throw await res.json()

	const data = await res.json()
	console.log(data)

} catch( err ) {
	console.log(err)
}

```

##### For Google Login
`	GET `http://localhost:5000/auth/google'`


##### For Local Login
` - POST 	`http://localhost:5000/api/auth/login'
`
```
const fields = {
	email: 'abc@gmail.com',
	password: 'yourpassword',
}

try {
	const res = await fetch('/api/auth/login', {
		method: 'POST',
		body: JSON.stringify(fields),
		headers: {
			'content-type': 'application/json',
			'accept': 'application/json',
		}
	})
	if( !res.ok ) throw await res.json()

	const data = await res.json()
	console.log(data)

} catch (err) {
	console.log(err)
}
```



##### For OTP Login
`
```
{
  "phone" : "01957500605"
}
POST 	/api/auth/send-otp 

- Check Message for OTP 
- for testing, I'm  sending otp via email

testing email: credentials checkout in group
```


```
{
    "otp": 2429,
    "phone": "01957500605",
    "role": "vendor",                           [ default role=vendor ]
    "hash": "g0jjVjXHr+q2ZBiKsS+4pvmgpbHJ4jAbS8q0MbF+uAs=.1719659241411"
}
POST 	/api/auth/verify-otp  	
```




##### For Logout (local/google)
` - POST 	`http://localhost:5000/api/auth/logout'
`
```
try {
	const res = await fetch('/api/auth/logout', { method: 'POST' })
	if( !res.ok ) throw await res.json()

	const data = await res.json()
	console.log(data)

} catch (err) {
	console.log(err)
}
```

##### Update Email via email verification
```
body {
  "email" : "riajul@gmail.com"
}
POST 	/api/auth/update-email                  : Check email `mailtrap` for testing
```


- Copy/paste the `link` in url or click that link, which will update email, [make sure you are `logedIn` User]

```
GET  http......./api/auth/update-email/:resetToken?email=riajul@gmail.com
```


##### Update Phove via OTP Message
```
{
  "phone": "01957500606"
}
POST 	/api/auth/update-phone                  : Check phone `mailtrap` for testing


{
  "otp" : "9256",
  "phone": "01957500606",
  "hash": "1v8vGUyIrHyXXmAjnBwUoUNjQls4TA/yHgMI828lxBw=.1724504917047"
}
PATCH 	/api/auth/update-phone                  : Check phone `mailtrap` for testing



```






### API Features 
- pagination | search | sort | filtered fields are applied on every `GET /api/[route-name]`

	- `GET {{origin}}/api/products`
	- `GET {{origin}}/api/reviews`
	- `GET {{origin}}/api/users`
        ...


```
{{origin}}/api/products
	?_page=2
	&_limit=3
	&_filter[category]=pant
	&_sort=-createdAt,price 						# field1,field2,...
	&_search=awesome product,name,summary,description 			# find text 'awesome product' in name, or summary or description any of  field
	&_fields=name,summary,price 			# only get those 3 fields + populated + build-in fields


http://localhost:5000/api/products?_limit=3&_page=2&_search=awesome product,name,summary,description&_sort=-createdAt,price&-fields=name,summary,price

```


##### Pagination
Request: ` GET {{origin}}/api/products?_limit=2&_page=1 `

Respose:
``` 
{
  "status": "success",
  "total": 2,
  "data": [
    {
      "coverPhoto": {
        "public_id": "26735687-95f7-4f41-a1c1-b5d8411a35d6",
        "secure_url": "/upload/images/cover-photo.jpg"
      },
      "_id": "6649eb35dabbe03d553861f0",
      "user": "6649e861c74ab9431356dce9",
      "name": "my-product-name-1",
      "slug": "my-product-name-1",
      "price": 40,
      "quantity": 2,
      "summary": "summary description between 10-150",
      "description": "description between 10-1000",
      "category": "shirt",
      "brand": "niki",
      "size": "xs",
      "images": [
        {
          "public_id": "9d362a03-0412-4505-ae8e-6fff5c1f24db",
          "secure_url": "/upload/images/photo-1.jpg",
          "_id": "6649eb35dabbe03d553861f1"
        },
        {
          "public_id": "9a4ea4a0-e61f-426f-ba6f-2a5983ef44f5",
          "secure_url": "/upload/images/photo-2.jpg",
          "_id": "6649eb35dabbe03d553861f2"
        },
        {
          "public_id": "30463a7c-f89f-4504-9ba2-72e354a353eb",
          "secure_url": "/upload/images/photo-3.jpg",
          "_id": "6649eb35dabbe03d553861f3"
        }
      ],
      "stock": 0,
      "sold": 0,
      "revenue": 0,
      "numReviews": [],
      "ratings": 4,
      "createdAt": "2024-05-19T12:06:13.298Z",
      "updatedAt": "2024-05-19T12:06:13.298Z",
      "__v": 0
    },
    {
      "coverPhoto": {
        "public_id": "7cc1638b-8cd0-4ed8-8864-9d64bc3eabbe",
        "secure_url": "/upload/images/cover-photo.jpg"
      },
      "_id": "6649ebc8dabbe03d553861f9",
      "user": "6649e861c74ab9431356dce9",
      "name": "it is my sample product",
      "slug": "it-is-my-sample-product",
      "price": 500,
      "quantity": 5,
      "summary": "summary description between 10-150",
      "description": "description between 10-1000",
      "category": "pant",
      "brand": "niki",
      "size": "xs",
      "images": [
        {
          "public_id": "e60a264c-a092-4fb0-90b3-9678e31de131",
          "secure_url": "/upload/images/photo-1.jpg",
          "_id": "6649ebc8dabbe03d553861fa"
        },
        {
          "public_id": "b7556573-d26e-41ae-b8d8-89594dd6d97d",
          "secure_url": "/upload/images/photo-2.jpg",
          "_id": "6649ebc8dabbe03d553861fb"
        },
        {
          "public_id": "bad341d0-038a-49ac-b4e1-e2e467a38a3c",
          "secure_url": "/upload/images/photo-3.jpg",
          "_id": "6649ebc8dabbe03d553861fc"
        }
      ],
      "stock": 0,
      "sold": 0,
      "revenue": 0,
      "numReviews": [],
      "ratings": 4,
      "createdAt": "2024-05-19T12:08:40.114Z",
      "updatedAt": "2024-05-19T12:08:40.114Z",
      "__v": 0
    }
  ]
}
```



##### Search 
find 'sample product' text in ***name*** or ***slug*** or ***summary*** or ***descript*** fields

Request: ` GET {{origin}}/api/products?_search=sample product,name,slug,summary,description `


Respose:
``` 
{
  "status": "success",
  "total": 1,
  "data": [
    {
      "coverPhoto": {
        "public_id": "7cc1638b-8cd0-4ed8-8864-9d64bc3eabbe",
        "secure_url": "/upload/images/cover-photo.jpg"
      },
      "_id": "6649ebc8dabbe03d553861f9",
      "user": "6649e861c74ab9431356dce9",
      "name": "it is my sample product",
      "slug": "it-is-my-sample-product",
      "price": 500,
      "quantity": 5,
      "summary": "summary description between 10-150",
      "description": "description between 10-1000",
      "category": "pant",
      "brand": "niki",
      "size": "xs",
      "images": [
        {
          "public_id": "e60a264c-a092-4fb0-90b3-9678e31de131",
          "secure_url": "/upload/images/photo-1.jpg",
          "_id": "6649ebc8dabbe03d553861fa"
        },
        {
          "public_id": "b7556573-d26e-41ae-b8d8-89594dd6d97d",
          "secure_url": "/upload/images/photo-2.jpg",
          "_id": "6649ebc8dabbe03d553861fb"
        },
        {
          "public_id": "bad341d0-038a-49ac-b4e1-e2e467a38a3c",
          "secure_url": "/upload/images/photo-3.jpg",
          "_id": "6649ebc8dabbe03d553861fc"
        }
      ],
      "stock": 0,
      "sold": 0,
      "revenue": 0,
      "numReviews": [],
      "ratings": 4,
      "createdAt": "2024-05-19T12:08:40.114Z",
      "updatedAt": "2024-05-19T12:08:40.114Z",
      "__v": 0
    }
  ]
}
``` 



##### Filter Fields 
instead of fetch entire ***document*** object, we can get only required ***fields*** which save bandwidth and response will be faster, because get minimum required data only.

Request: ` GET {{origin}}/api/products?_fields=name,price,brand`

Respose:
``` 
{
  "status": "success",
  "total": 2,
  "data": [
    {
      "_id": "6649eb35dabbe03d553861f0",
      "name": "my-product-name-1",
      "price": 40,
      "brand": "niki"
    },
    {
      "_id": "6649ebc8dabbe03d553861f9",
      "name": "it is my sample product",
      "price": 500,
      "brand": "niki"
    }
  ]
}

``` 






##### Sort by Fields 
we can sort our product by any fields, to show in UI according to user's needs

- show only latest 20 products
- show law price products 
- show top buy/sold products 
- ...


Request: ` GET {{origin}}/api/products?_limit=20&_sort=-createdAt`
Respose: Get Recently created 20 products only

Request: ` GET {{origin}}/api/products?_limit=20&_sort=price`
Respose: Get lawest pricey products

Request: ` GET {{origin}}/api/products?_limit=20&_sort=-price`
Respose: Get highest pricey products
...



## Products
Product GET/PATCH/DELETE can be either by `id` or by `slug`

- GET {{origin}}/api/products
- POST {{origin}}/api/products

- GET {{origin}}/api/products/6649ebc8dabbe03d553861f9
- GET {{origin}}/api/products/it-is-my-sample-product
-
- PATCH {{origin}}/api/products/6649ebc8dabbe03d553861f9
- PATCH {{origin}}/api/products/it-is-my-sample-product
-
- DELETE {{origin}}/api/products/6649ebc8dabbe03d553861f9
- DELETE {{origin}}/api/products/it-is-my-sample-product
-
- GET {{origin}}/api/products/get-random-products?_limit=5      : default value 5


```
GET /api/products/
GET /api/products/?_page=1&_limit=4
GET /api/products/?_sort='createdAt' 										: any field name, or multiple field name
GET /api/products/?_search='search value, name,slug' 	: Search on any fields: namly `name` & `slug`
GET /api/products/?_fields='name,slug,price' 	        : Only got 3 fields (+ _id, populated fields)
```

#### Get Products
```
# Get all products
- GET {{origin}}/api/products

# Get 20 products per page
- GET {{origin}}/api/products?_limit=20&_page=1

# Search 'sample product' in `name` | `slug` | `summary` | `description`
- GET {{origin}}/api/products?_search=sample product,name,slug,summary,description

# Only got given fields, instead of entire Doc
- GET {{origin}}/api/products?_fields=name,price,brand

# Show products based on price : lowest to height order
- GET {{origin}}/api/products?_sort=-price
```

#### Get Random Products
```
- GET {{origin}}/api/products/get-random-products               : get only 5 random products 
- GET {{origin}}/api/products/get-random-products?_limit=20     : get any number of random product
```

#### Get all Products of single user
```
- GET {{origin}}/api/users/:userId/products
```

#### Get Multiple Products by product IDs
```
body {
  "productIds": [
    "667ea9b1df5d6c0e864f1841",
    "667fc61231ae221f0375d86a"
  ]
}

POST {{origin}}/api/products/many                       : To get multiple products
```

#### Add Product
```
body: {
  "customId": 'unique-id',
  "user": logedInUser.id,                               (*) : comes from logedIn session
  "name": "it is my sample product",                    (*)
  "slug": "it-is-my-sample-product-unitque",
  "price": 500,                                         (*)
  "quantity": 5,
  "summary": "summary description between 10-150",      (*)
  "description": "description between 10-1000",         (*)
  
  "category": "pant",                                   (*)
  "brand": "niki",                                      (*)
  "size": "xs",                                         (*)
  
  "coverPhoto": "data:jpg/images;alkjdfajd...=",        (*)
  "images": [                                           (*) : at least one image
     "data:jpg/images;alkjdfajd...=",
     "data:jpg/images;rraksdjfasdkjf...=",
     "data:jpg/images;fflkjdfajd...=",
  ]
  
# "video" : "data:image/jpeg;base64,/9j/4A...",           # to upload raw video
  "video" : "http://your-video-lingk-',                   # to upload video link
  specifications: {
          screenSize: "...",
          batteryLife: "",
          cameraResolution: "",
          storageCapacity: "",
          os: "",
          size: "",
          material: "",
          color: "",
          gender: ""
  },
  
  discount: "232",
  subCategory: "subCategory._id",
  warranty: "...",
  discountPrice: "...",
  packaging: {
 	weight: string
 	height: string
 	width: string
 	dimension: string
  },

  status: "string"


  "productVariants": [                          : To add product variants
    {
      "name": "string 1",
      "price": 500,
      "discount": 30,
      "quantity": 2,
      "gender": "string",
      "color": "string",
      "material": "string",
      "size": "string",
      "image": "data:jpg/images;alkjdfajd...=",
    },
    {
      "name": "string 2",
      "price": "number",
      "discount": "number",
      "quantity": "number",
      "gender": "string",
      "color": "string",
      "material": "string",
      "size": "string",
      "image": "data:jpg/images;alkjdfajd...=",
    }
  ]
}

- POST {{origin}}/api/products
```


#### Update Product
```
# Only Update productVariant with variant id

body {
  "productVariant": {
    "id": "66d62252d8e66708a18adb62",
    "name": "string update again clean update",
    "price": 444,
    "_id": "66d6055047aa51aed002a8cef",
    "image": "data:jpg/images;alkjdfajd...=",
    "size": "updated"
  }
}


# Without productVariant id will add item to variant

body {
  "productVariant": {
    "id": "66d62252d8e66708a18adb62",
    "name": "string update again clean update",
    "price": 444,
    "_id": "66d6055047aa51aed002a8cef",
    "size": "updated",
    "image": "data:jpg/images;alkjdfajd...=",
  }
}


# Update product + update productVariant in the same time

body {
  "summary": "this is little summary so that identify product",

  "productVariant": {
    "id": "66d62252d8e66708a18adb62",
    "name": "string update again clean update",
    "price": 444,
    "_id": "66d6055047aa51aed002a8cef",
    "size": "updated"
  }
}


# Regular Update product 

body: {
  "customId": 'unique-id',
  "name": "it is my sample product",
  "slug": "it-is-my-sample-product-unitque",
  "price": 500,
  "quantity": 5,
  "summary": "summary description between 10-150",
  "description": "description between 10-1000",
  
  "category": "pant",
  "brand": "niki",
  "size": "xs",
  
  "coverPhoto": "data:jpg/images;alkjdfajd...=",
  "images": [
    "data:jpg/images;alkjdfajd...=",
    "data:jpg/images;rraksdjfasdkjf...=",
    "data:jpg/images;fflkjdfajd...=",
  ],

  # "video" : "data:image/jpeg;base64,/9j/4A...",       # to upload raw video
  "video" : "http://your-video-lingk-',                 # to upload video link
  specifications: {
    screenSize: "...",
    batteryLife: "",
    cameraResolution: "",
    storageCapacity: "",
    os: "",
    size: "",
    material: "",
    color: "",
    gender: ""
  },

  discount: "232",
  subCategory: "subCategory._id",
  warranty: "...",
  discountPrice: "...",
  packaging: {
    weight: string
    height: string
    width: string
    dimension: string
  },
  status: "string"
}

- PATCH {{origin}}/api/products/6649ebc8dabbe03d553861f9
- PATCH {{origin}}/api/products/it-is-my-sample-product
```






#### delete Product
```
- DELETE {{origin}}/api/products/6649ebc8dabbe03d553861f9                       : Delete product
- DELETE {{origin}}/api/products/it-is-my-sample-product

- DELETE /api/products/:productId?productVariantId='667ea9b1df5d6c0e864f1841'   : Delete only productVariant
```


#### Toggle Like Product
```
- GET {{origin}}/api/products/:productId/like
```


## Product-Variant
- GET {{origin}}/api/product-variants 		                // get all 
- GET {{origin}}/api/product-variants/:productVariantId         // Get Single 

- POST {{origin}}/api/product-variants                          // To create 
- PATCH {{origin}}/api/product-variants/:productVariantId       // To Update 
- DELETE {{origin}}/api/product-variants/:productVariantId      // To Delete


#### Add Product-Variant
```
body {
  "user" : "667e915a3204d8967daaf4a1",
  "name": "variant 2",
  "price": 200,                                                 (*)
  "discount": 20,
  "quantity": 2,
  "material" : "kniting",
  "size": "sm",                                                 (*)
  "gender": "common",
  "color" : "#fff",
  "image" : "data:image/jpg,aksdjadjf"
}

POST {{origin}}/api/product-variants
```

#### Update Product-Variant
```
body {
  "user" : "667e915a3204d8967daaf4a1",
  "name": "variant 2",
  "price": 200, 
  "discount": 20,
  "quantity": 2,
  "material" : "kniting",
  "size": "sm",    
  "gender": "common",
  "color" : "#fff",
  "image" : "data:image/jpg,aksdjadjf"
}
PATCH {{origin}}/api/product-variants/:productVariantId
```










## Reviews

- GET {{origin}}/api/reviews 		        // get all reviews
- GET {{origin}}/api/productId/reviews 		// get all reviews of single product
- GET {{origin}}/api/userId/reviews 		// get all reviews of single user
- GET {{origin}}/api/me/reviews 		// get all reviews of logedIn user


- POST {{origin}}/api/reviews

- GET {{origin}}/api/reviews/6649ebc8dabbe03d553861f9
- PATCH {{origin}}/api/reviews/6649ebc8dabbe03d553861f9
- DELETE {{origin}}/api/reviews/6649ebc8dabbe03d553861f9

- GET {{origin}}/api/products/:productId/reviews        // get all reviews on specific products



``` API featues

GET /api/reviews/
GET /api/reviews/?_page=1&_limit=4
GET /api/reviews/?_sort='createdAt' 			// any field name, or multiple field name
GET /api/reviews/?_search='search value, review'        // Search on any fields: namly `review` 
GET /api/reviews/?_fields='review,product,user'         // Only got 3 fields (+ _id, populated fields)


GET /api/reviews/                                       : Get all reviews + comments + replies
GET /api/reviews/?reviewsOnly=true                      : Get Only all Reviews 
GET /api/reviews/?commentsOnly=true                     : Get Only all comments 
GET /api/reviews/?repliesOnly=true                      : Get Only all Replies 
```

#### Add Review / Comment  / Reply
```
body: {
# "user": "will comes from logedIn User",
  "product": "6649ebc8dabbe03d553861f9",                (*)
  "image" : "data:image/jpeg;base64,/9j/4AAQSkZJRgA..."
  "ratings: 5, 

  # for Review
  "review" : "I'm using too (delete me)",

  # or for comment
  "comment": "this is comments on product",

  "replyTo: "comment.id / review.id"
}

- POST {{origin}}/api/reviews
```

#### Update Review / Comment
```
body: {
//"user": "user._id",                                   (*) : comes from logedIn sesssion

  "product": "6649ebc8dabbe03d553861f9",                (*)
  "image" : "data:image/jpeg;base64,A..."              

  # for Review
  "review" : "I'm using too (delete me)",

  # or for comment
  "comment": "this is comments on product"

  "replyTo: "comment.id / review.id"
}

- PATCH {{origin}}/api/reviews/reviewId
```


#### Get Single Review / Comment

- GET /api/reviews/reviewId                     // Get single Review by reviewId
- GET /api/products/productId/reviews/reviewId  // Get single Review by reviewId of product
- GET /api/users/userId/reviews/reviewId        // Get single Review by reviewId of user
- GET /api/users/me/reviews/reviewId            // Get single Review by reviewId of logedInUser


## Users

- GET {{origin}}/api/users                      // Get all users
- GET {{origin}}/api/users?filter[role]=vendor  // Get all users role=vendor

- POST {{origin}}/api/auth/register
- POST {{origin}}/api/auth/login
- POST {{origin}}/api/auth/logout
- GET {{origin}}/auth/google

- GET {{origin}}/api/users/me 
- GET {{origin}}/api/users/6649ebc8dabbe03d553861f9

- PATCH {{origin}}/api/users/me
- PATCH {{origin}}/api/users/6649ebc8dabbe03d553861f9

- DELETE {{origin}}/api/users/me
- DELETE {{origin}}/api/users/6649ebc8dabbe03d553861f9

- PATCH {{origin}}/api/auth/update-password
- POST {{origin}}/api/auth/forgot-password
- PATCH {{origin}}/api/auth/reset-password


- GET {{origin}}/api/users/:userId/vouchers     // Get all vouchers of this user
- GET {{origin}}/api/users/me/vouchers          // Get all vouchers of logedIn User

```
GET /api/users/
GET /api/users/?_page=1&_limit=4
GET /api/users/?_sort='createdAt' 										: any field name, or multiple field name
GET /api/users/?_search='search value, name,email' 		: Search on any fields: namly `name,email` 
GET /api/users/?_fields='review,product,user' 				: Only got 3 fields (+ _id, populated fields)
```

#### Register User (Locally)
```
body {
  "name" : "delete me",                                 (*)
  "email" : "delete@gmail.com",
  "password" : "asdfasdf",                              (*)
  "confirmPassword" : "asdfasdf",                       (*)
  "role" : "admin",
  "avatar" : "data:image/jpeg;base64,/9j/4AAQSkZJRgA..."

  isActive: ?, 			: handled by backend only
  isVerified: ?, 			: handled by backend only
  gender: '', 			: ['male', 'female', 'other', 'undefined'],
  phone: "...",
  location: {
        address1: '',
	address2: '',
	city: '',
	state: '',
	postcode: 0000,
	country: '',
  },

  otherPermissions : {
		isVendor: false, 	: boolean value: true/false
		isCustomer: false,
		isCategories: false,
		isProducts: false,
		isOrders: false,
		isReviews: false,
		isVouchers: false,
		isAdManager: false,
		isRoleManager: false,
		isMessageCenter: false,
		isFinance: false,
		isShipment: false,
		isSupport: false,
		isEventManager: false,
		isMessage: false,

		isHasDashboard: false,
		isHasBanner: false,
		isHasPropUpAdds: false,
  },

  idCardFrontPageImage: "image.png",
  idCardBackPageImage: "image.png",
  idCardNumber: "2434212412",
  bankStatementImage: "image.png",
  accountHolderName: "John Doe",
  accountNumber: "2434212412",
  routingNumber: "2434212412",
  bankName: "Bank Name",
  bankBranch: "Bank Branch", 
  
  status: "pending", 
  isFeatured: true,
}


- POST {{origin}}/api/auth/register
```

#### Update User 
```
body: {
	customId: string
	name: string
	email: string
	coverPhoto: string
	avatar: string
	otherPermissions : {
		isVendor: boolean,
		isCustomer: boolean,
		isCategories: boolean,
		isProducts: boolean,
		isOrders: boolean,
		isReviews: boolean,
		isVouchers: boolean,
		isAdManager: boolean,
		isRoleManager: boolean,
		isMessageCenter: boolean,
		isFinance: boolean,
		isShipment: boolean,
		isSupport: boolean,
		isEventManager: boolean,
		isMessage: boolean,

		isHasDashboard: false,
		isHasBanner: false,
		isHasPropUpAdds: false,
	}

	idCardFrontPageImage: Image
	idCardBackPageImage: Image
	bankStatementImage: Image
	idCardNumber: string
	accountHolderName: string
	accountNumber: string
	routingNumber: string
	bankName: string
	bankBranch: string

	status: string
        isFeatured: true,
	email: string
	phone: string
}


- PATCH {{origin}}/api/users/:userId
```





#### User Login 
```
body: {
  "email": "riajul@gmail.com",  Or  "email": "01916800154"      (*)
  "password": "{{pass}}"                                        (*)
}

- POST {{origin}}/api/auth/register
```



#### User Logout 
```
- POST {{origin}}/api/auth/logout
```


#### Update User  
```
body: {
	"customId": 'unique-id',
  "name": "riajul islam",
  "address": "gulshan, badda, dhaka-1212",
  "gender" : "male",
	"coverPhoto" : "data:image/jpeg;base64,/9j/4AAQSkZJRgA...",
	"avatar" : "data:image/jpeg;base64,/9j/4AAQSkZJRgA...",
	"phone" : "",
	"gender" : "",
	"location: {
		address1: string
		address2: string
		city: string
		state: string
		postcode: number,
		country: string
	},
	otherPermissions : {
		isVendor: boolean,
		isCustomer: boolean,
		isCategories: boolean,
		isProducts: boolean,
		isOrders: boolean,
		isReviews: boolean,
		isVouchers: boolean,
		isAdManager: boolean,
		isRoleManager: boolean,
		isMessageCenter: boolean,
		isFinance: boolean,
		isShipment: boolean,
		isSupport: boolean,
		isEventManager: boolean,
		isMessage: boolean,
	},

        idCardFrontPageImage: "image.png",
        idCardBackPageImage: "image.png",
        idCardNumber: "2434212412",
        bankStatementImage: "image.png",
        accountHolderName: "John Doe",
        accountNumber: "2434212412",
        routingNumber: "2434212412",
        bankName: "Bank Name",
        bankBranch: "Bank Branch", 

        status: "pending", 
}

- PATCH {{origin}}/api/users/6649ebc8dabbe03d553861f9
- PATCH {{origin}}/api/users/me
```

#### Update User password
```
body: {
  "currentPassword": "asdfasdff",                       (*)
  "password": "asdfasdf",                               (*)
  "confirmPassword": "asdfasdf"                         (*)
}

- PATCH {{origin}}/api/auth/update-password
```



#### Forgot User password
```
body: {
  "email": "riajul@gmail.com"                           (*)
}

- POST {{origin}}/api/auth/forgot-password
```



#### Reset User password
```
body: {
  "resetToken" : "8a25491050a62334fb1ec5ca4a1ec...",    (*)
  "password": "{{pass}}",                               (*)
  "confirmPassword": "{{pass}}"                         (*)
}

- PATCH {{origin}}/api/auth/reset-password
```


#### Delete User 
```
- DELETE {{origin}}/api/users/me
- DELETE {{origin}}/api/users/6649ebc8dabbe03d553861f9
```





## Image Upload

- To upload file, file must be `base64` encoded `dataUrl`

```
const image  = input(type='file' name='avatar')

image.addEventListener('change', async (evt) => {
	cosnt file = evt.files[0]

	const reader = new FileReader()
	reader.readAsDataUrl( file )
	reader.onload = () => {
		if(reader.readyState === 2) {
			const dataUrl = reader.result

			try {

				const res = await fetch('/api/auth/register', {
					method: 'POST',
					body: JSON.stringify({ ..., avatar: dataUrl })
					headers: {
						'content-type': 'application/json',
						'accept': 'application/json',
					},
					credentials: 'include'
				})

				if(!res.ok) throw await res.json()
				const { status, data } = await res.json()
				console.log( data )

			} catch (error) {
				console.log( error )
			}
		}
	}
})
```

- Upload image on File Storage : Hard Dist 
- if file upload `maxSize`, cross limit then file upload will be failed with throwing error to user
- only user himself or admin user can update or delete other user

- restrict user based on `user.role`

```
GET /api/users 			: Only `user.role = 'admin'`  allows to see the users
PATCH /api/users 		: Only user himself or admin can update other users
DELETE /api/users 	: Only user himself or admin can delete other users
```












## Vouchers
- GET {{origin}}/api/vouchers 		        // get all vouchers
- GET {{origin}}/api/users/:userId/vouchers     // Get all vouchers of this user
- GET {{origin}}/api/users/me/vouchers          // Get all vouchers of logedIn User
- GET {{origin}}/api/vouchers/:voucherId        // Get Single Voucher by (_id), not client's voucherId

- POST {{origin}}/api/vouchers                  // To create voucher
- PATCH {{origin}}/api/vouchers/:voucherId      // To Update 
- DELETE {{origin}}/api/vouchers/:voucherId     // To Delete


#### Add Voucher
```
body {
  "user": "user._id",                                   (*)
  "voucherId": "random-voucher-id",
  "discount": 40,
  "redeemCode": "ATC20",
  "startDate": "2024-07-12T13:45:49.432Z",
  "endDate": "2024-07-12T13:45:49.432Z",
  "status" : "active"

  "discountType": "string",
  "minimumPurchase": "string"
}

POST {{origin}}/api/vouchers
```




#### Update Voucher
```
body {
  "user": "user._id",
  "voucherId": "random-voucher-id",
  "discount": 40,
  "redeemCode": "ATC30",
  "startDate": "2024-07-12T13:45:49.432Z",
  "endDate": "2024-07-12T13:45:49.432Z",
  "status" : "active"

  "discountType": "string",
  "minimumPurchase": "string"
}
PATCH {{origin}}/api/vouchers/:voucherId
```






## Cagegory
- GET {{origin}}/api/categories 		        // get all categories
- GET {{origin}}/api/categories/:categoryId             // Get Single Category by categoryId

- POST {{origin}}/api/categories                        // To create category
- PATCH {{origin}}/api/categories/:categoryId           // To Update 
- DELETE {{origin}}/api/categories/:categoryId          // To Delete


#### Add Category
```
{
  "name": "category-name",                              (*)
  "shippingCharge": "200",
  "shippingChargeType": "string",
  "vat": "2",
  "vatType": "string",
  "status": "active",
  "commission": "0",
  "commissionType": "string",
  "image: "data:image/jpg;a3wwra...",
  "iconImage: "data:image/jpg;a3wwra...",
  "icon": "my icon name",
  "transactionCost": "2",
  "transactionCostType": "string",
  "transactionId": "askdjfalsdjf",
  "isHomeShown": false
}

POST {{origin}}/api/categories
```


#### Update Category
```
body {
  "name": "category-new-name",
  "shippingCharge": "200",
  "shippingChargeType": "string",
  "vat": "2",
  "vatType": "string",
  "status": "active",
  "commission": "0",
  "commissionType": "string",
  "icon": "my icon name",
  "image: "data:image/jpg;a3wwra...",
  "iconImage: "data:image/jpg;a3wwra...",
  "transactionCost": "2",
  "transactionCostType": "string",
  "transactionId": "askdjfalsdjf",
  "isHomeShown": false

}
PATCH {{origin}}/api/categories/:categoryId
```




## SubCagegory
- GET {{origin}}/api/sub-categories                    // get all subCategories
- GET {{origin}}/api/sub-categories/:subCategoryId     // Get Single subCategory by subCategoryId

- POST {{origin}}/api/sub-categories                    // To create subCategory
- PATCH {{origin}}/api/sub-categories/:subCategoryId    // To Update 
- DELETE {{origin}}/api/sub-categories/:subCategoryId   // To Delete



#### Add SubCategory
```
{
  "category": "category._id",                           (*)
  "name": "category-name",                              (*)
  "shippingCharge": "200",
  "shippingChargeType": "string",
  "vat": "2",
  "vatType": "string",
  "status": "active",
  "commission": "0"
  "commissionType": "string",
  "image: "data:image/jpg;a3wwra...",
  "icon": "my icon name",
  "transactionCost": "2"
  "transactionCostType": "string",
}

POST {{origin}}/api/sub-categories
```


#### Update SubCategory
```
body {

  "name": "subCcategory-new-name",
  "image: "data:image/jpg;a3wwra...",
  "icon": "my icon name",
  "shippingCharge": "200",
  "shippingChargeType": "string",
  "vat": "2",
  "vatType": "string",
  "status": "active",
  "commission": "0",
  "commissionType": "string",
  "transactionCost": "2",
  "transactionCostType": "string",
}
PATCH {{origin}}/api/sub-categories/:subCategoryId
```



## Packages
- GET {{origin}}/api/packages 		        
- GET {{origin}}/api/packages/:packageId       

- POST {{origin}}/api/packages                
- PATCH {{origin}}/api/packages/:packageId   
- DELETE {{origin}}/api/packages/:packageId 



#### Add Package
```
body {
  "name": "package name 2",                             (*)
  "user": "667ff88eb5dfd416e36015ad",                   (*)
  "status": "active",
  "duration": 5,
  "price": 300,
  "maxProduct": 10
  "image: "data:image/jpg;a3wwra...",
  "description": "any description",   
}

POST {{origin}}/api/packages
```




#### Update Package
```
body {
  "name": "package name 2",        
  "status": "active",
  "duration": 5,
  "price": 300,
  "maxProduct": 10
  "image: "data:image/jpg;a3wwra...",
  "description": "any description",   
}
PATCH {{origin}}/api/packages/:packageId
```


## PackageProducts      (To add selecteProduct into packages.packageProducts)                         
- GET {{origin}}/api/package-products 		                # get all 
- GET {{origin}}/api/package-products/:packageProductId         # Get Single 

- POST {{origin}}/api/package-products                          # To create 
- PATCH {{origin}}/api/package-products/:packageProductId       # To Update 
- DELETE {{origin}}/api/package-products/:packageProductId      # To Delete


#### Add PackageProuct 
```
body {
  "user" : "667e915a3204d8967daaf4a1",                  (*)
  "product" : "667ea9b1df5d6c0e864f1841",               (*)
  "package" : "66c1f8ca97074e09b1ee95b6",               (*)
  "name" : "package one"                                 
}

POST {{origin}}/package-products/:packageProductId
```

#### Update package-product
```
body {
  "user" : "667e915a3204d8967daaf4a1",
  "product" : "667ea9b1df5d6c0e864f1841",
  "package" : "66c1f8ca97074e09b1ee95b6",
  "name" : "package two"                                 # (optional)
}

PATCH {{origin}}/package-products/:packageProductId
```


#### Get Multiple Package-Products by packageProductIds
```
body {
  "packageProductIds": [
    "66cb15a49a40eb566f4ffba8",
    "66c1fb657f3326eca9bc9fce"
  ]
}

POST {{origin}}/api/package-products/many                 : To get multiple package products
```






## Order
- GET   /api/orders                             : Get All orders
- GET   /api/orders/:orderId                    : Get Single Order
- POST  /api/orders/many                        : Get Multiple Order by req.body.orderIds=[]

- GET   /api/users/:userId/orders               : Get All orders of given users
- GET   /api/users/me/orders                    : Get All orders of logedIn users

- POST  /api/orders                             : To Create single/multiple Order

- PATCH /api/orders/:orderId 	                : Only Admin (role='admin') can update Order status
- DELETE /api/orders/:orderId 	                : Only Admin (role='admin') can delete Order

- GET   /api/users/:userId/orders               : Get orders of Single User



#### Get Multiple Orders
```
{
  "orderIds": [
	"66d1cf0cbc804e7f656c84de",
	"66d1cfe2e2827162cd584631"
	]
}
POST {{origin}}/api/orders/many
```


#### To create Single Order
```
#  for Single Order send Object
- ***transactionId*** Must be unique per transaction, but will be same for multiple product item

body {
  "user" : "66cb6175017d8682d2b9e6ef",
  "vendor": "66cb6175017d8682d2b9e6ef",
  "product" : "667ea9b1df5d6c0e864f1841",
  "variantId" : "667ea9b1df5d6c0e864f1814",
  "transactionId" : "UniqueId",                         : Unique Id

  "price": 525,
  "currency": "BDT",
  "paymentType":  "cash-on-delivery",  
  "status": "pending", 

  "shippingInfo" : {
    "name": "riajul islam",
    "email": "riajul@gmail.com",
    "phone": "01957500605",
    
    "method": "Courier",
    "address1": "shipping address",
    "address2": "",
    "city": "Dhaka",
    "state": "Dhaka",
    "postcode": 1000,
    "country": "Bangladesh",
    
    "deliveryFee": 40
  },

  "vat": 4,
  "commission": 20,
  "transactionCost": 50,
  "shippingCharge": 50,
  "profit": 20,
  "quantity": 2,
  "vendorPaid": "unpaid" 		                : any string allowed
}




#  for Multiple Order send Array Object

body [
  {
    "user" : "66cb6175017d8682d2b9e6ef",
    "vendor": "66cb6175017d8682d2b9e6ef",
    "product" : "667ea9b1df5d6c0e864f1841",
    "variantId" : "667ea9b1df5d6c0e864f1814",
    "transactionId" : "UniqueId",                         : Unique Id, but same for product one
  
    "price": 525,
    "currency": "BDT",
    "paymentType":  "cash-on-delivery",  
    "status": "pending", 
  
    "shippingInfo" : {
      "name": "riajul islam",
      "email": "riajul@gmail.com",
      "phone": "01957500605",
      
      "method": "Courier",
      "address1": "shipping address",
      "address2": "",
      "city": "Dhaka",
      "state": "Dhaka",
      "postcode": 1000,
      "country": "Bangladesh",
      
      "deliveryFee": 40
    },

    "vendor": "66cb6175017d8682d2b9e6ef",
    "vat": 4,
    "commission": 20,
    "transactionCost": 50,
    "shippingCharge": 50,
    "profit": 20,
    "quantity": 2,
    "vendorPaid": "unpaid" 		                : any string allowed
  },

  {
    "user" : "66cb6175017d8682d2b9e6ef",
    "vendor": "66cb6175017d8682d2b9e6ef",
    "product" : "667ea9b1df5d6c0e864f1841",
    "variantId" : "667ea9b1df5d6c0e864f1814",
    "transactionId" : "UniqueId",                         : Unique Id, but same for 2nd product 
  
    "price": 525,
    "currency": "BDT",
    "paymentType":  "cash-on-delivery",  
    "status": "pending", 
  
    "shippingInfo" : {
      "name": "riajul islam",
      "email": "riajul@gmail.com",
      "phone": "01957500605",
      
      "method": "Courier",
      "address1": "shipping address",
      "address2": "",
      "city": "Dhaka",
      "state": "Dhaka",
      "postcode": 1000,
      "country": "Bangladesh",
      
      "deliveryFee": 40
    },

    "vat": 4,
    "commission": 20,
    "transactionCost": 50,
    "shippingCharge": 50,
    "profit": 20,
    "quantity": 2,
    "vendorPaid": "unpaid" 		                : any string allowed
  }
]

POST {{origin}}/api/orders
```


#### To update Cash On PaymentStatus
```
body {
  "status": "completed",                          : ['pending', 'completed', 'shipped', 'cancelled']
  "vendorPaid": "unpaid" 		          : any string allowed
}
PATCH {{origin}}/api/orders/:orderId
```





## Payments
- GET /api/payments                             : Get All Payments

- GET /api/users/:userId/payments               : Get payments of Single User
- GET /api/payments/:paymentId                  : Get Single Payment
- PATCH /api/payments/:paymentId 	        : Only Admin (role='admin') can update payment status
- DELETE /api/payments/:paymentId 	        : Only Admin (role='admin') can delete payment

- POST  /api/payments                           : To Create Cash Payment

--- incomplete ---
- GET   /api/payments/request                   : Get Online Payment Gateway to Pay
- POST  /api/payments/success/:transactionId    : Online Handled Success
- POST  /api/payments/cancel/:transactionId     : Online Handled Cancel


#### Cash On Payment
```
{
  "products": [
    {
      "product": "667ea9b1df5d6c0e864f1841",
      "price": 43,
      "quantity": 3,
		  "vendor": "667e915a3204d8967daaf4a1",
			"status": "pending",
			"vendorPayment": {
        "vat": 4,
        "commission": 3,
        "payableAmount": 200,
        "profit": 50
      },
      "vendorPaymentStatus": "non-paid"
    },
    {
      "product": "667fc61231ae221f0375d86a",
      "price": 430,
      "quantity": 2,
		  "vendor": "667e915a3204d8967daaf4a1",
			"status": "pending",
			"vendorPayment": {
        "vat": 4,
        "commission": 3,
        "payableAmount": 200,
        "profit": 50
      },
      "vendorPaymentStatus": "paid"

    },
    {
      "product": "667fc61231ae221f0375d86a",
      "price": 430,
      "quantity": 2,
		  "vendor": "667e915a3204d8967daaf4a1",
			"status": "pending",
			"vendorPayment": {
        "vat": 4,
        "commission": 3,
        "payableAmount": 200,
        "profit": 50
      },
      "vendorPaymentStatus": "non-paid"

    }
  ],
  "status": "pending",
  "currency": "BDT",
  "paymentType": "cash",
  "user": "667e915a3204d8967daaf4a1",
  "shippingInfo": {
    "name": "Riajul Islam",
    "email": "riajul@gmail.com",
    "phone": "01957500605",
    "method": "Courier",
    "address1": "shipping address",
    "address2": "",
    "city": "Dhaka",
    "state": "Dhaka",
    "postcode": 1000,
    "country": "Bangladesh",
    "deliveryFee": 50
  },
  "orderCost": 516,
  "profit": 100,
  "brand": "BrandName"
}


POST {{origin}}/api/payments
```


#### To update Cash On PaymentStatus
```
body {
  "status": "completed",                          : ['pending', 'completed', 'shipped', 'cancelled']
}
PATCH {{origin}}/api/payments/:paymentId
```





## Messaging
I used ***socket.io*** for messaging, if need socket.io client in `frontend`
so you have 2 ways to do so

1. you can get eighter by `socket.io-client` npm package or 
2. you can add add bellow link on your page 

```
		<script defer src='{{origin}}/socket.io/socket.io.js'> </script>
```


#### Example of sending messages
```
See the Messaging Example: `{{origin}}/message`
See the Messaging Example: `/public/js/pages/user/message.js`
```


## Others | Banner, ...othes non-related fields
- GET {{origin}}/api/others 		    // get all 
- GET {{origin}}/api/others/:otherId        // Get Single 

- POST {{origin}}/api/others                // To create 
- PATCH {{origin}}/api/others/:otherId      // To Update 
- DELETE {{origin}}/api/others/:otherId     // To Delete


#### Add Other  / banner
```
body {
  "user": "user._id",                                   (*)
  "name": "any name",
  "banner": "any tag name",
  "image" : "data:image/jpg,aksdjadjf",

  "mobileBanner" : "data:image/jpg,aksdjadjf",
  "popupImageMobile" : "data:image/jpg,aksdjadjf",
  "logo" : "data:image/jpg,aksdjadjf",
  "popupImage" : "data:image/jpg,aksdjadjf",

	"link": "http://your-image-link"
}

POST {{origin}}/api/vouchers
```

#### Update Other / Banner Image
```
body {
  "name": "any name",
  "banner": "any tag name",
  "user": "user._id",
  "image" : "data:image/jpg,aksdjadjf"

  "mobileBanner" : "data:image/jpg,aksdjadjf",
  "popupImageMobile" : "data:image/jpg,aksdjadjf",
  "logo" : "data:image/jpg,aksdjadjf",
  "popupImage" : "data:image/jpg,aksdjadjf",

	"link": "http://your-image-link"
}
PATCH {{origin}}/api/other/:otherId
```






## Events
- GET {{origin}}/api/events 		    // get all 
- GET {{origin}}/api/events/:eventId        // Get Single 

- POST {{origin}}/api/events                // To create 
- PATCH {{origin}}/api/events/:eventId      // To Update 
- DELETE {{origin}}/api/events/:eventId     // To Delete

### Event Document Sample:
```
{
  "status": "success",
  "total": 2,
  "data": [
    {
      "_id": "66c1f8ca97074e09b1ee95b6",
      "user": "667e915a3204d8967daaf4a1",
      "name": "event name one",
      "status": "pending",
      "createdAt": "2024-08-18T13:36:10.977Z",
      "updatedAt": "2024-08-18T13:36:10.977Z",
      "__v": 0,
      "eventProducts": [                        # To add/remove/update see `/api/event-products` api
        {
          "_id": "66c1facf7f3326eca9bc9fbf",
          "event": "66c1f8ca97074e09b1ee95b6",
          "user": "667e915a3204d8967daaf4a1",
          "product": "667ea9b1df5d6c0e864f1841",
        },
        {
          "_id": "66c1fb657f3326eca9bc9fce",
          "event": "66c1f8ca97074e09b1ee95b6",
          "user": "667e915a3204d8967daaf4a1",
          "product": "667ea9b1df5d6c0e864f1841",
          "__v": 0
        }
      ],
      "id": "66c1f8ca97074e09b1ee95b6"
    },
    {
      "_id": "66c1f99d9c99b8974c1617ca",
      "user": "667e915a3204d8967daaf4a1",
      "status": "comming soon",
      "eventProducts": [],
      "id": "66c1f99d9c99b8974c1617ca"
    }
  ]
}
```

#### Add Event 
```
body {
  "user": "user._id",                                   (*)
  "name": "any name",                                   (*)
  "image" : "data:image/jpg,aksdjadjf"
  "status": "status",                                   (*)
  "startDate": "new Date( Date.now() )",
  "endDate": "new Date( Date.now() + 1000 * 60 * 60 * 5)",
  "description": "any description",   
  "price": 200
}

POST {{origin}}/events/:eventId
```

#### Update Event
```
body {
  "name": "any name",
  "user": "user._id",
  "image" : "data:image/jpg,aksdjadjf"
  "status": "status",
  "startDate": "new Date( Date.now() )",
  "endDate": "new Date( Date.now() + 1000 * 60 * 60 * 5)",
  "description": "any description",   
  "price": 200
}
PATCH {{origin}}/events/:eventId
```






## EventProducts      (To add selecteProduct into events.eventProducts)                         
- GET {{origin}}/api/event-products 		        // get all 
- GET {{origin}}/api/event-products/:eventProductId     // Get Single 

- POST {{origin}}/api/event-products                    // To create 
- PATCH {{origin}}/api/event-products/:eventProductId   // To Update 
- DELETE {{origin}}/api/event-products/:eventProductId  // To Delete


#### Add EventProuct 
```
body {
  "user" : "667e915a3204d8967daaf4a1",                  (*)
  "product" : "667ea9b1df5d6c0e864f1841",               (*)
  "event" : "66c1f8ca97074e09b1ee95b6",                 (*)
  "name" : "events two"                                 
}

POST {{origin}}/event-products/:eventProductId
```

#### Update Event
```
body {
  "user" : "667e915a3204d8967daaf4a1",
  "product" : "667ea9b1df5d6c0e864f1841",
  "event" : "66c1f8ca97074e09b1ee95b6",
  "name" : "events two"                                 // (optional)
}

PATCH {{origin}}/event-products/:eventProductId
```


#### Get Multiple Event-Products by eventProductIds
```
body {
  "eventProductIds": [
    "66cb15a49a40eb566f4ffba8",
    "66c1fb657f3326eca9bc9fce"
  ]
}

POST {{origin}}/api/event-products/many                 : To get multiple event products
```







## Finance
- GET {{origin}}/api/finances 		        // get all 
- GET {{origin}}/api/finances/:financeId        // Get Single 

- POST {{origin}}/api/finances                  // To create 
- PATCH {{origin}}/api/finances/:financeId      // To Update 
- DELETE {{origin}}/api/finances/:financeId     // To Delete


#### Add Finance 
```
body {
  "user": "user._id",                                   (*)
  "order": "payment._id",                               (*)
  "name": "any name",                                   (*)
  "brand": "brand",                                     (*)
  "phone": "phone no",                                  (*)
  "email": "email add",                                 (*)
  "profit": 400                                         (*)
  "orderCost": 400                                      (*)
}

POST {{origin}}/finances/:financeId
```

#### Update Finance
```
body {
  "name": "any name",
  "user": "user._id",
  "order": "payment._id",
  "brand": "brand",
  "phone": "phone no",
  "email": "email add",
  "profit": 400
  "orderCost": 400
}
PATCH {{origin}}/finances/:financeId
```







## Payable Payments
- GET {{origin}}/api/payablePayments 		                // get all 
- GET {{origin}}/api/payablePayments/:payablePaymentId          // Get Single 

- POST {{origin}}/api/payablePayments                           // To create 
- PATCH {{origin}}/api/payablePayments/:payablePaymentId        // To Update 
- DELETE {{origin}}/api/payablePayments/:payablePaymentId       // To Delete


#### Add PayablePayment 
```
body {
  "user": "user._id",                                   (*)
  "VendorName": "any name",                             (*)
  "profit": 400
  "phone": "phone no",                                  (*)
  "email": "email add",                                 (*)
  "order": "payment._id",
  "brand": "brand",
  "totalEarning": 400                                   (*)
  "totalOrder": 400                                     (*)
}

POST {{origin}}/payablePayments/:payablePaymentId
```

#### Update PayablePayment
```
body {
  "user": "user._id",
  "profit": 400
  "VendorName": "any name",
  "phone": "phone no",
  "email": "email add",
  "order": "payment._id",
  "brand": "brand",
  "totalEarning": 400
  "totalOrder": 400
}
PATCH {{origin}}/payablePayments/:payablePaymentId
```







## Delivery-fees
- GET {{origin}}/api/delivery-fees 		        // get all 
- GET {{origin}}/api/delivery-fees/:deliveryFeeId       // Get Single 

- POST {{origin}}/api/delivery-fees                     // To create 
- PATCH {{origin}}/api/delivery-fees/:deliveryFeeId     // To Update 
- DELETE {{origin}}/api/delivery-fees/:deliveryFeeId    // To Delete

- GET {{origin}}/api/delivery-fees/reset                // (Admin Only) Reset to default 64 entry
- GET {{origin}}/api/delivery-fees?_limit=64 		// get 64 document only 

- PATCH {{origin}}/delivery-fees/update-many            // To update multiple fees


#### Add Delivery-fee 
```
{
  "district" : "rajshahi",                              (*)
  "deliveryFee" : 50                                    (*)
}

POST {{origin}}/delivery-fees/:deliveryFeeId
```

#### Update Delivery-fee
```
body {
  "district" : "rajshahi",
  "deliveryFee" : 50
}

PATCH {{origin}}/delivery-fees/:deliveryFeeId
```

#### Update Many Delivery-fee
```
body {
  "deliveryFeeIds": [
    "66c75de27bbb9c8e5d45950b",                         # deliveryFeeId
    "66c75de27bbb9c8e5d45950f",                         # deliveryFeeId
    "66c75de27bbb9c8e5d45951f"                          # deliveryFeeId
    ...
  ],
  "deliveryFee" : 150
}

PATCH {{origin}}/delivery-fees/update-many
```









## Report
- GET {{origin}}/api/reports  				: Get All Reports + Chats
- GET {{origin}}/api/reports?reportsOnly=true 		: Only Get reports
- GET {{origin}}/api/reports?chatsOnly=true 		: Only Get chats 

- GET {{origin}}/api/reports/:reportId                  : Get Single 

- POST {{origin}}/api/reports                           : To create 
- PATCH {{origin}}/api/reports/:reportId                : To Update 
- DELETE {{origin}}/api/reports/:reportId               : To Delete


#### Add Report 
If product._id exists in while creating report, it will be product report,
else it will can be used for personal chats, between users  (user and admin)

```
body {
  "product" : "667e915a3204d8967daaf4a1",               : It is report about product (because productId exits)

  "user" : "667e915a3204d8967daaf4a1",                  (*)
  "title": "test report 2",                             (*)
  "message": "this is a sourt summary",                 (*)
  "description": "long descriptions goes here"
  "image" : "data:image/jpg,aksdjadjf"
}

POST {{origin}}/api/reports/
```

```
body {
  "user" : "667e915a3204d8967daaf4a1",                  : It is chats
  "title": "test report 2",
  "message": "this is a sourt summary",
  "description": "long descriptions goes here",
  "image": "data://..."
}
POST {{origin}}/api/reports  				: 
```



#### Update Report
```
body {
  "product" : "667e915a3204d8967daaf4a1",     
  "title": "test report 2",                             
  "message": "this is a sourt summary",                
  "description": "long descriptions goes here"
  "image" : "data:image/jpg,aksdjadjf"
}
PATCH {{origin}}/api/reports/:reportId 
```







