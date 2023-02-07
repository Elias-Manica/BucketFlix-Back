# BucketFlix - backend

My project Full Stack doing everything from the ideia, layout, backend, frontend to the deploy in the AWS, using PostgresSQL!


## How to run for development

1. Clone this repository
2. Install all dependencies

```bash
npm i
```

3. Run the dump or create a PostgreSQL database with whatever name you want 
4. Configure the `.env` file using the `.env.example` file 

## Start the project

```bash
npm start
```
## Routes

| Function        | method | Endpoint       |
| --------------| ------ | -------------- |
| **SIGN IN**     | POST   | `/sign-in`       |

| Body               | Type                                 |
| --------------------| ------------------------------------ |
| **email**           | string(required)                     |
| **username**           | string(required)                     |
| **pictureUrl**        | string(required)                     |


### Example

request:

```json
  {
	"email": "teste@gmail.com",
	"username": "josé",
	"pictureUrl": "https://img.freepik.com/vetores-premium/homem-perfil-caricatura_18591-58482.jpg?w=2000"
  }
```

response:


```json
  {
	"user": {
		"id": 1,
		"email": "teste@gmail.com",
		"username": "josé",
		"pictureUrl": "https://img.freepik.com/vetores-premium/homem-perfil-caricatura_18591-58482.jpg?w=2000"
	},
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJpYXQiOjE2NzUxNzI1NDJ9.ziit0agqZx_417QJeeQG9cHGsLGCfwSZihrhqA8AQDM"
  }
```

| Function        | method | Endpoint       |
| --------------| ------ | -------------- |
| **LOGOUT**     | POST   | `/logout`       |

| Body               | Type                                 |
| --------------------| ------------------------------------ |
| **email**           | string(required)                     |
| **username**           | string(required)                     |
| **pictureUrl**        | string(required)                     |

required pass bearer token  in headers

| Function        | method | Endpoint       |
| --------------| ------ | -------------- |
| **ADD MOVIE IN DB**     | POST   | `/add-movie`       |

| Body               | Type                                 |
| --------------------| ------------------------------------ |
| **movieid**           | number(required)                     |

required pass bearer token  in headers

### Example

request:

```json
{
	"movieid": 550
}
```


| Function        | method | Endpoint       |
| --------------| ------ | -------------- |
| **FAVORITE A MOVIE**     | POST   | `/add-movie/favorite`       |

| Body               | Type                                 |
| --------------------| ------------------------------------ |
| **movieid**           | number(required)                     |

required pass bearer token  in headers

### Example

request:

```json
{
	"movieid": 550
}
```

| Function        | method | Endpoint       |
| --------------| ------ | -------------- |
| **MOVIE IS LIKED**     | POST   | `/add-movie/isfavorite`       |

| Body               | Type                                 |
| --------------------| ------------------------------------ |
| **movieid**           | number(required)                     |
required pass bearer token  in headers

### Example

request:

```json
{
	"movieid": 550
}
```

| Function        | method | Endpoint       |
| --------------| ------ | -------------- |
| **UNFAVORITE MOVIE**     | DELETE   | `/add-movie/favorite?favoriteid=${id}`       |

 required pass bearer token  in headers

| Function        | method | Endpoint       |
| --------------| ------ | -------------- |
| **POST A COMMENT**     | POST   | `/comments`       |

| Body               | Type                                 |
| --------------------| ------------------------------------ |
| **movieid**           | number(required)                     |
| **comment**           | string(required)                     |
| **rating**           | rating(required)                     |

required pass bearer token  in headers

### Example

request:

```json
{
	"movieid": 550,
	"comment": "muito bom",
	"rating": 3
}
```

| Function        | method | Endpoint       |
| --------------| ------ | -------------- |
| **COMMENTS OF A MOVIE**     | GET   | `/comments?movieid=${MOVIEID}`       |

required pass bearer token  in headers

```json
 [
	{
		"id": 3,
		"userid": 1,
		"movieid": 550,
		"comment": "muito bom",
		"rating": 3,
		"createdat": "2023-01-26T00:00:00.000Z",
		"updatedat": "2023-01-26T00:00:00.000Z",
		"users": {
			"id": 1,
			"email": "teste@gmail.com",
			"username": "teste",
			"pictureUrl": "https://img.freepik.com/vetores-premium/homem-perfil-caricatura_18591-58482.jpg?w=2000",
			"createdat": "2023-01-23T00:00:00.000Z",
			"updatedat": "2023-01-23T00:00:00.000Z"
		}
	},
	{
		"id": 5,
		"userid": 4,
		"movieid": 550,
		"comment": "bem bom mesmo",
		"rating": 5,
		"createdat": "2023-01-30T00:00:00.000Z",
		"updatedat": "2023-01-30T00:00:00.000Z",
		"users": {
			"id": 4,
			"email": "gamerflasho632@gmail.com",
			"username": "Flasho Gamer",
			"pictureUrl": "https://lh3.googleusercontent.com/a/AEdFTp4GA6mxc2AP1ggiwr-WIeAk8eXqrqLnLYFkcFnV=s96-c",
			"createdat": "2023-01-29T00:00:00.000Z",
			"updatedat": "2023-01-29T00:00:00.000Z"
		}
	}
]
```


| Function        | method | Endpoint       |
| --------------| ------ | -------------- |
| **ALL COMMENTS DONE BY USER**     | GET   | `/comments/users?userid=${USERID}&page=1`       |

required pass bearer token  in headers

| Function        | method | Endpoint       |
| --------------| ------ | -------------- |
| **DELETE COMMENT**     | DELETE   | `/comments?commentid=${COMMENTEID}`       |

required pass bearer token  in headers

| Function        | method | Endpoint       |
| --------------| ------ | -------------- |
| **WATCH A MOVIE**     | POST   | `/add-movie/watched`       |

| Body               | Type                                 |
| --------------------| ------------------------------------ |
| **movieid**           | number(required)                     |
| **rating**           | rating(required)                     |

required pass bearer token  in headers

### Example

request:

```json
{
	"movieid": 550,
	"rating": 3
}
```

| Function        | method | Endpoint       |
| --------------| ------ | -------------- |
| **GET WATCHED LIST A MOVIE**     | GET   | `/add-movie/watched/list?userid=${USERID}`       |

response:


```json
  [
	{
		"id": 5,
		"userid": 54,
		"movieid": 436270,
		"rating": 3,
		"createdat": "2023-01-31T00:00:00.000Z",
		"updatedat": "2023-01-31T00:00:00.000Z",
		"movie": {
			"id": 85,
			"movieid": 436270,
			"original_title": "Black Adam",
			"title": "Adão Negro",
			"overview": "Quase 5.000 anos depois de ter sido concedido com os poderes onipotentes dos deuses egípcios - e de ter sido preso, - Adão Negro se ergue de seu túmulo, pronto para trazer sua justiça ao mundo moderno.",
			"poster_path": "/9z256FFPDsL7kSVJ9oyLELaN1ph.jpg",
			"tagline": "O mundo precisava de um herói. Agora ele tem Adão Negro.",
			"popularity": 1491.364,
			"release_date": "2022-10-19"
		}
	},
	{
		"id": 6,
		"userid": 54,
		"movieid": 315162,
		"rating": 5,
		"createdat": "2023-01-31T00:00:00.000Z",
		"updatedat": "2023-01-31T00:00:00.000Z",
		"movie": {
			"id": 69,
			"movieid": 315162,
			"original_title": "Puss in Boots: The Last Wish",
			"title": "Gato de Botas 2: O Último Pedido",
			"overview": "O Gato de Botas descobre que sua paixão pela aventura cobrou seu preço: ele queimou oito de suas nove vidas, deixando-o com apenas uma vida restante. Gato parte em uma jornada épica para encontrar o mítico Último Desejo e restaurar suas nove vidas.",
			"poster_path": "/pSr0JjkI9iM1Yxe9cqrS6YBonAA.jpg",
			"tagline": "Diga hola para seus amiguinhos.",
			"popularity": 7675.741,
			"release_date": "2022-12-07"
		}
	}
]
```

| Function        | method | Endpoint       |
| --------------| ------ | -------------- |
| **GET MOVIE IS WATCHED**     | GET   | `/add-movie/watched?movieid=${MOVIEID}`       |

required pass bearer token  in headers


| Function        | method | Endpoint       |
| --------------| ------ | -------------- |
| **SEARCH USER BY NAME**     | GET   | `/user/name?username=${NAMEUSER}`       |

response:


```json
[
	{
		"id": 1,
		"email": "teste@gmail.com",
		"username": "teste",
		"pictureUrl": "https://img.freepik.com/vetores-premium/homem-perfil-caricatura_18591-58482.jpg?w=2000",
		"createdat": "2023-01-23T00:00:00.000Z",
		"updatedat": "2023-01-23T00:00:00.000Z"
	},
	{
		"id": 2,
		"email": "test@gmail.com",
		"username": "teste",
		"pictureUrl": "https://img.freepik.com/vetores-premium/homem-perfil-caricatura_18591-58482.jpg?w=2000",
		"createdat": "2023-01-24T00:00:00.000Z",
		"updatedat": "2023-01-24T00:00:00.000Z"
	}
]
```

| Function        | method | Endpoint       |
| --------------| ------ | -------------- |
| **FOLLOW USER**     | FOLLOW   | `/user/follow?userid=${USERID}`       |

required pass bearer token  in headers

| Function        | method | Endpoint       |
| --------------| ------ | -------------- |
| **UNFOLLOW USER**     | UNFOLLOW   | `/user/follow?userid=${USERID}`       |

required pass bearer token  in headers

| Function        | method | Endpoint       |
| --------------| ------ | -------------- |
| **GET FOLLOWS USER**     | UNFOLLOW   | `/user/follow?userid=${USERID}`       |

required pass bearer token  in headers

```json
{
	"following": 2,
	"followers": 1,
	"comments": 0
}
```

