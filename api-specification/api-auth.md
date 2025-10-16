# Auth API Specification

**Base path**: `/api/v1/auth`  
**Authentication**: Not required (public endpoints)  
**Content type**: `application/json` requests and responses

All authentication-protected routes elsewhere in the API expect a Bearer access token issued by these endpoints. Tokens are JWTs signed with the server secret; TTL is controlled via `ACCESS_TOKEN_TTL` (access) and `REFRESH_TOKEN_TTL` (refresh).

Common error formats:

| Status | When                                   | Body example |
| ------ | -------------------------------------- | ------------ |
| 400    | Validation failed (Zod)                | `{ "message": "Validation failed", "issues": [...] }` |
| 401    | Invalid credentials                    | `{ "message": "Invalid credentials" }` |
| 409    | Email already registered               | `{ "message": "Email already registered" }` |
| 500    | Unexpected server error                | `{ "message": "Unexpected error occurred" }` |

---

## POST `/register`

Create a new user account and return access/refresh tokens.

### Request Body

| Field        | Type   | Required | Constraints                          |
| ------------ | ------ | -------- | ------------------------------------ |
| `email`      | string | ✓        | Must be a valid email address        |
| `password`   | string | ✓        | Minimum length 8 characters          |
| `displayName`| string | ✗        | 1–100 characters                     |

### Success Response

- **Status**: `201 Created`
- **Body**:

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "displayName": "Optional Name",
    "role": "USER",
    "createdAt": "2025-10-16T00:00:00.000Z",
    "updatedAt": "2025-10-16T00:00:00.000Z"
  },
  "tokens": {
    "accessToken": "jwt",
    "refreshToken": "jwt"
  }
}
```

---

## POST `/login`

Authenticate an existing user and issue fresh tokens.

### Request Body

| Field      | Type   | Required | Constraints                   |
| ---------- | ------ | -------- | ----------------------------- |
| `email`    | string | ✓        | Must be a valid email address |
| `password` | string | ✓        | Minimum length 1 character    |

### Success Response

- **Status**: `200 OK`
- **Body**: Same shape as the `/register` response.

---

### Notes

- Store the `accessToken` for authenticated API calls (`Authorization: Bearer <token>`).
- Use the `refreshToken` according to your token refresh flow (not implemented in this API set).
