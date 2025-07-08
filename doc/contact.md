# Contact API Spec

## Create Contact

Endpoint: POST /api/contacts

Headers:

- Authorization: token

Request Body:

```json
{
  "firstName": "Wahyu",
  "lastName": "Ramadan",
  "email": "wramdan1203@gmail.com",
  "phone": "081933195630"
}
```

Response Body (Success):

```json
{
  "data": {
    "id": UUID,
    "firstName": "Wahyu",
    "lastName": "Ramadan",
    "email": "wramdan1203@gmail.com",
    "phone": "081933195630"
  }
}
```

## Get Contact

Endpoint: GET /api/contacts/:contactId

Headers:

- Authorization: token

Response Body (Success):

```json
{
  "data": {
    "id": UUID,
    "firstName": "Wahyu",
    "lastName": "Ramadan",
    "email": "wramdan1203@gmail.com",
    "phone": "081933195630"
  }
}
```

## Update Contact

Endpoint: PATCH /api/contacts

Headers:

- Authorization: token

Request Body:

```json
{
  "firstName": "Wahyu",
  "lastName": "Ramadan",
  "email": "wramdan1203@gmail.com",
  "phone": "081933195630"
}
```

Response Body (Success):

```json
{
  "data": {
    "id": UUID,
    "firstName": "Wahyu",
    "lastName": "Ramadan",
    "email": "wramdan1203@gmail.com",
    "phone": "081933195630"
  }
}
```

## Remove Contact

Endpoint: DELETE /api/contacts/:contactId

Headers:

- Authorization: token

Response Body (Success):

```json
{
  "data": true
}
```

## Search Contact

Endpoint: GET /api/contacts

Query Params:

- name: string (contact first name or last name) - optional
- phone: string - optional
- email: string - optional
- page: number - optional (default 1)
- limit: number - optional (default 20)

Headers:

- Authorization: token

Response Body (Success):

```json
{
  "paging": {
    "currentPage": 1,
    "totalPage": 10,
    "limit": 20,
  },
  "data": [
    {
      "id": UUID,
      "firstName": "Wahyu",
      "lastName": "Ramadan",
      "email": "wramdan1203@gmail.com",
      "phone": "081933195630"
    },
    {
      "id": UUID,
      "firstName": "Wahyu",
      "lastName": "Aldyansah",
      "email": "aldy@gmail.com",
      "phone": "081249565620"
    }
  ]
}
```
