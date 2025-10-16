# Budgets API Specification

**Base path**: `/api/v1/budgets`  
**Authentication**: Required (`Authorization: Bearer <accessToken>`)  
**Content type**: `application/json`

Responses wrap budget resources in a `data` property unless otherwise noted.

Common error formats:

| Status | When                                                | Body example |
| ------ | --------------------------------------------------- | ------------ |
| 400    | Validation failed (payload or params)               | `{ "message": "Validation failed", "issues": [...] }` |
| 401    | Missing/invalid bearer token                        | `{ "message": "Missing bearer token" }` |
| 404    | Budget not found for update/delete                  | `{ "message": "Budget not found" }` |
| 500    | Unexpected server error                             | `{ "message": "Unexpected error occurred" }` |

---

## GET `/`

List all budgets for the authenticated user.

- **Status**: `200 OK`
- **Response body**:

```json
{
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "name": "Q4 Operating Budget",
      "targetAmount": 120000,
      "periodStart": "2025-10-01T00:00:00.000Z",
      "periodEnd": "2025-12-31T23:59:59.000Z",
      "createdAt": "2025-09-01T12:00:00.000Z",
      "updatedAt": "2025-09-15T08:45:00.000Z"
    }
  ]
}
```

---

## POST `/`

Create a new budget period and spending target.

### Request Body

| Field          | Type   | Required | Constraints                          |
| -------------- | ------ | -------- | ------------------------------------ |
| `name`         | string | ✓        | Minimum length 1                     |
| `targetAmount` | number | ✓        | Must be > 0                          |
| `periodStart`  | date   | ✓        | Parsed via `Date` constructor        |
| `periodEnd`    | date   | ✓        | Parsed via `Date` constructor        |

> `periodStart` ≤ `periodEnd` validation must be enforced client-side if desired (server does not check ordering during creation).

### Success Response

- **Status**: `201 Created`
- **Body**: `{ "data": <Budget> }`

---

## PUT `/:id`

Update an existing budget. Only provided fields are changed.

### Path Parameters

| Param | Type   | Description   |
| ----- | ------ | ------------- |
| `id`  | string | Budget UUID   |

### Request Body

All fields optional; same validation rules as creation.

| Field          | Type   | Notes                |
| -------------- | ------ | -------------------- |
| `name`         | string | Minimum length 1     |
| `targetAmount` | number | Must be > 0          |
| `periodStart`  | date   | ISO-8601 date string |
| `periodEnd`    | date   | ISO-8601 date string |

### Success Response

- **Status**: `200 OK`
- **Body**: `{ "data": <Updated Budget> }`

---

## DELETE `/:id`

Remove a budget by ID.

### Path Parameters

| Param | Type   | Description   |
| ----- | ------ | ------------- |
| `id`  | string | Budget UUID   |

### Success Response

- **Status**: `204 No Content`

---

### Notes

- Budget amounts are stored as fixed-precision decimals and emitted as numbers.
- Transactions reference budgets through `budgetId`; deleting a budget does not automatically reassign related transactions.
