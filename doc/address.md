# Address API Spec

## Create Address

Endpoint: POST /api/contacts/:contactId/address

Headers:

- Authorization: token

Reques Body:

```json
{
  "street": "Jalan Contoh", // optional
  "city": "Kota",
  "province": "Provinsi", // optional
  "country": "Negara",
  "postalCide": "1123123"
}
```

Response Body:

```json
{
  "data": {
    "id": UUID,
    "street": "Jalan Contoh",
    "city": "Kota",
    "province": "Provinsi",
    "country": "Negara",
    "postalCide": "1123123"
  }
}
```

## Get Address

Endpoint: GET /api/contacts/:contactId/address/:addressId

Headers:

- Authorization: token

Response Body:

```json
{
  "data": {
    "id": UUID,
    "street": "Jalan Contoh",
    "city": "Kota",
    "province": "Provinsi",
    "country": "Negara",
    "postalCide": "1123123"
  }
}
```

## Update Address

Endpoint: PATCH /api/contacts/:contactId/address/:addressId

Headers:

- Authorization: token

Reques Body:

```json
{
  "street": "Jalan Contoh", // optional
  "city": "Kota",
  "province": "Provinsi", // optional
  "country": "Negara",
  "postalCide": "1123123"
}
```

Response Body:

```json
{
  "data": {
    "id": UUID,
    "street": "Jalan Contoh",
    "city": "Kota",
    "province": "Provinsi",
    "country": "Negara",
    "postalCide": "1123123"
  }
}
```

## Remove Address

Endpoint: DELETE /api/contacts/:contactId/address/:addressId

Headers:

- Authorization: token

Response Body:

```json
{
  "data": true
}
```

## List Addresses

Endpoint: GET /api/contacts/:contactId/addresses

Headers:

- Authorization: token

Response Body:

```json
{
  "data": [
    {
      "id": UUID,
      "street": "Jalan Contoh 1",
      "city": "Kota 1",
      "province": "Provinsi 1",
      "country": "Negara 1",
      "postalCide": "1123123 1"
    },
    {
      "id": UUID,
      "street": "Jalan Contoh 2",
      "city": "Kota 2",
      "province": "Provinsi 2",
      "country": "Negara 2",
      "postalCide": "1123123 2"
    }
  ]
}
```
