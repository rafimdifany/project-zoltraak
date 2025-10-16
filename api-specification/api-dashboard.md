# Dashboard API Specification

**Base path**: `/api/v1/dashboard`  
**Authentication**: Required (`Authorization: Bearer <accessToken>`)  
**Content type**: `application/json`

This module returns aggregated overview data across transactions, budgets, and assets for the authenticated user.

Common error formats:

| Status | When                                                | Body example |
| ------ | --------------------------------------------------- | ------------ |
| 400    | Validation failed (invalid `from`/`to` query)       | `{ "message": "Validation failed", "issues": [...] }` |
| 401    | Missing/invalid bearer token                        | `{ "message": "Missing bearer token" }` |
| 500    | Unexpected server error                             | `{ "message": "Unexpected error occurred" }` |

---

## GET `/`

Retrieve a consolidated financial overview. Optional date filters limit the transactions considered when computing income/expense totals and recent transactions.

### Query Parameters

| Param | Type | Required | Description                                   |
| ----- | ---- | -------- | --------------------------------------------- |
| `from`| date | ✗        | ISO-8601 date; filters data occurring **on or after** this date |
| `to`  | date | ✗        | ISO-8601 date; filters data occurring **on or before** this date |

> If both `from` and `to` are supplied, `from` must be ≤ `to`.

### Success Response

- **Status**: `200 OK`
- **Body**:

```json
{
  "data": {
    "totals": {
      "income": 25000,
      "expense": 17200,
      "net": 7800,
      "assets": 520000
    },
    "recentTransactions": [
      {
        "id": "txn-uuid",
        "type": "EXPENSE",
        "category": "Software",
        "amount": 120.5,
        "occurredAt": "2025-10-15T18:30:00.000Z",
        "description": "Team SaaS subscription"
      }
    ],
    "budgets": [
      {
        "id": "budget-uuid",
        "userId": "uuid",
        "name": "Q4 Operating Budget",
        "targetAmount": 120000,
        "periodStart": "2025-10-01T00:00:00.000Z",
        "periodEnd": "2025-12-31T23:59:59.000Z",
        "createdAt": "2025-09-01T12:00:00.000Z",
        "updatedAt": "2025-09-15T08:45:00.000Z",
        "spent": 45000
      }
    ],
    "assets": [
      {
        "id": "asset-uuid",
        "userId": "uuid",
        "name": "Brokerage",
        "category": "Investments",
        "currentValue": 15000.5,
        "createdAt": "2025-10-15T23:59:59.000Z",
        "updatedAt": "2025-10-15T23:59:59.000Z"
      }
    ]
  }
}
```

---

### Notes

- `totals.net` is computed as `income - expense`.
- `recentTransactions` is limited to the 5 most recent entries after filtering.
- `budgets.spent` aggregates expense transactions linked to each budget.
- Asset totals (`totals.assets`) reflect the sum of current asset values without date filtering.
