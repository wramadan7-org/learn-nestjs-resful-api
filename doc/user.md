# User API Spec

## Register User

Endpoint: POST /api/users

Request Body:

```json
{
  "username": "admin",
  "password": "admin",
  "name": "Wahyu Ramadan"
}
```

Response Body (Success):

```json
{
  "data": {
    "username": "admin",
    "name": "Wahyu Ramadan"
  }
}
```

Response Body (Error):

```json
{
  "errors": "Username already registered"
}
```

## Login User

Endpoint: POST /api/users/login

Request Body:

```json
{
  "username": "admin",
  "password": "admin"
}
```

Response Body (Success):

```json
{
  "data": {
    "username": "admin",
    "name": "Wahyu Ramadan",
    "token": "session_id_generated"
  }
}
```

Response Body (Error):

```json
{
  "errors": "Username or password is wrong"
}
```

## Get User

Endpoint: POST /api/users/current

Headers:

- Authorizaion: token

Response Body (Success):

```json
{
  "data": {
    "username": "admin",
    "name": "Wahyu Ramadan"
  }
}
```

Response Body (Error):

```json
{
  "errors": "Unauthorized"
}
```

## Update User

Endpoint: PATCH /api/users/current

Headers:

- Authorization: token

Request Body:

```json
{
  "password": "admin", // optional if want to change password
  "name": "Wahyu Ramadan" // optional if want to change name
}
```

Response Body (Success):

```json
{
  "data": {
    "username": "admin",
    "name": "Wahyu Ramadan"
  }
}
```

Response Body (Error):

```json
{
  "errors": "Fail to updated user"
}
```

## Logout user

Endpoint: DELETE /api/users/current

Headers:

- Authorization: token

Response Body (Success):

```json
{
  "data": true
}
```

Response Body (Error):

```json
{
  "errors": "Fail to logout"
}
```
