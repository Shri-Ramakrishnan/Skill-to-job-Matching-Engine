

- Axios automatically attaches `Authorization: Bearer <token>`.
- Global 401/403 handling clears auth and redirects user to login.
- Controlled forms and consistent error extraction improve UI stability.
- Token-expiry based auto logout is implemented in Auth Context.
