# Transactions API Specification

**Base path**: `/api/v1/transactions`  
**Authentication**: Required (`Authorization: Bearer <accessToken>`)  
**Content type**: `application/json`

Transaction responses wrap resources in a `data` property unless otherwise noted.

Common error formats:

| Status | When                                                | Body example |
| ------ | --------------------------------------------------- | ------------ |
| 400    | Validation failed (payload or params)               | `{ "message": "Validation failed", "issues": [...] }` |
| 401    | Missing/invalid bearer token                        | `{ "message": "Missing bearer token" }` |
| 404    | Transaction not found for update/delete             | `{ "message": "Transaction not found" }` |
| 500    | Unexpected server error                             | `{ "message": "Unexpected error occurred" }` |

---

## GET `/`

List all transactions for the authenticated user (most recent first).

- **Status**: `200 OK`
- **Response body**:

```json
{
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "type": "EXPENSE",
      "category": "Software",
      "amount": 120.5,
      "occurredAt": "2025-10-15T18:30:00.000Z",
      "description": "SaaS subscription",
      "budgetId": "budget-uuid",
      "createdAt": "2025-10-15T18:30:00.000Z",
      "updatedAt": "2025-10-15T18:30:00.000Z"
    }
  ]
}
```

---

## POST `/`

Create a new transaction.

### Request Body

| Field        | Type                      | Required | Constraints                                   |
| ------------ | ------------------------- | -------- | --------------------------------------------- |
| `type`       | `"INCOME"` \| `"EXPENSE"` | ✓        | Enum                                          |
| `category`   | string                    | ✓        | Minimum length 1                              |
| `amount`     | number                    | ✓        | Must be > 0                                   |
| `occurredAt` | date                      | ✓        | Parsed via `Date` constructor (ISO string)    |
| `description`| string                    | ✗        | Optional, max length 500                      |
| `budgetId`   | string \| null            | ✗        | Optional; supply UUID to associate to budget  |

### Success Response

- **Status**: `201 Created`
- **Body**: `{ "data": <Transaction> }`

---

## PUT `/:id`

Update an existing transaction. Only provided fields are changed.

### Path Parameters

| Param | Type   | Description        |
| ----- | ------ | ------------------ |
| `id`  | string | Transaction UUID   |

### Request Body

All fields optional; same validation rules as creation.

| Field        | Type                      | Notes                                         |
| ------------ | ------------------------- | --------------------------------------------- |
| `type`       | `"INCOME"` \| `"EXPENSE"` | Enum                                          |
| `category`   | string                    | Minimum length 1                              |
| `amount`     | number                    | Must be > 0                                   |
| `occurredAt` | date                      | ISO-8601 string                               |
| `description`| string                    | Optional, max 500 characters                  |
| `budgetId`   | string \| null            | Provide null to disassociate from a budget    |

### Success Response

- **Status**: `200 OK`
- **Body**: `{ "data": <Updated Transaction> }`

---

## DELETE `/:id`

Remove a transaction.

### Path Parameters

| Param | Type   | Description        |
| ----- | ------ | ------------------ |
| `id`  | string | Transaction UUID   |

### Success Response

- **Status**: `204 No Content`

---

### Notes

- Transactions are always scoped to the authenticated user; cross-user access attempts will behave as “not found”.
- Monetary values are stored as fixed-precision decimals and emitted as numbers.
- Linking to a budget (`budgetId`) enables dashboard budget progress tracking.
