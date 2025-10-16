# Assets API Specification

**Base path**: `/api/v1/assets`  
**Authentication**: Required (`Authorization: Bearer <accessToken>`)  
**Content type**: `application/json`

Responses for successful operations wrap resources in a `data` property unless otherwise noted.

Common error formats:

| Status | When                                                | Body example |
| ------ | --------------------------------------------------- | ------------ |
| 400    | Validation failed (payload or params)               | `{ "message": "Validation failed", "issues": [...] }` |
| 401    | Missing/invalid bearer token                        | `{ "message": "Missing bearer token" }` |
| 404    | Asset not found for update/delete                   | `{ "message": "Asset not found" }` |
| 500    | Unexpected server error                             | `{ "message": "Unexpected error occurred" }` |

---

## GET `/`

List all assets owned by the authenticated user.

- **Status**: `200 OK`
- **Response body**:

```json
{
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "name": "Brokerage",
      "category": "Investments",
      "currentValue": 15000.5,
      "createdAt": "2025-10-15T23:59:59.000Z",
      "updatedAt": "2025-10-15T23:59:59.000Z"
    }
  ]
}
```

---

## POST `/`

Create a new asset.

### Request Body

| Field          | Type   | Required | Constraints                          |
| -------------- | ------ | -------- | ------------------------------------ |
| `name`         | string | ✓        | Minimum length 1                     |
| `category`     | string | ✗        | Optional, max length 100             |
| `currentValue` | number | ✓        | Must be ≥ 0                          |

### Success Response

- **Status**: `201 Created`
- **Body**: `{ "data": <Asset> }` (same shape as list items)

---

## PUT `/:id`

Update an existing asset. Only provided properties are modified.

### Path Parameters

| Param | Type   | Required | Description      |
| ----- | ------ | -------- | ---------------- |
| `id`  | string | ✓        | Asset UUID       |

### Request Body

All fields optional; same validation rules as creation.

| Field          | Type   | Notes                       |
| -------------- | ------ | --------------------------- |
| `name`         | string | Minimum length 1            |
| `category`     | string | Optional, max length 100    |
| `currentValue` | number | Must be ≥ 0                 |

### Success Response

- **Status**: `200 OK`
- **Body**: `{ "data": <Updated Asset> }`

---

## DELETE `/:id`

Remove an asset.

### Path Parameters

| Param | Type   | Description  |
| ----- | ------ | ------------ |
| `id`  | string | Asset UUID   |

### Success Response

- **Status**: `204 No Content`
- **Body**: _Empty_

---

### Notes

- Asset values are stored as fixed-precision decimals in the database and returned as JavaScript numbers.
- All asset operations are scoped to the authenticated user; cross-user access attempts will behave as “not found”.
