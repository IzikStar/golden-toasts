# API Reference

All routes are served under the global prefix **`/api`** (e.g. `POST http://localhost:3078/api/auth/login`).

Every route requires a valid JWT in an `Authorization: Bearer <token>` header **unless it is marked _Public_**.
Authentication is enforced by a global `AuthGuard`; admin-only routes additionally use an `IsAdminGuard`.
Request bodies are validated with `class-validator` (unknown fields are rejected).

This document lists all API routes for the Toasts backend, with detailed permissions and behavior by role.

---

## ✔️ Auth

- **POST** `/auth/login`  
  _Permissions_: Public (no auth)  
  Returns a JWT on successful authentication

---

## 🧑 Users

- **GET** `/users`  
  _Permissions_: Any user may retrieve the list of all users

- **GET** `/users/:userId/current-period-toasts-amount`  
  _Permissions_: Any user may retrieve the number of toasts a user completed in the current half-year period

- **GET** `/users/:userId`  
  _Permissions_: Any user may retrieve a single user's public details

- **GET** `/users/criminals`  
  _Permissions_: Any user may retrieve the list of users flagged as criminals

- **POST** `/users`  
  _Permissions_: Public (no auth)  
  Creates a new user account and returns a JWT

- **PUT** `/users/:userId`  
  _Permissions_:

  - Regular user: may update only their own `username` and `password`
  - Admin: may update any user’s `isAdmin` and `isPersonaNonGrata` flags

- **DELETE** `/users/:userId`  
  _Permissions_: Only the authenticated user may delete their own account

---

## 🧾 Invitations

- **GET** `/invites/receiver/:userId/pending`  
  _Permissions_: Only the specified user may retrieve their own pending invites

- **GET** `/invites/sender/:userId`  
  _Permissions_: Only the specified user may retrieve invites they have sent

- **GET** `/invites/toast/:toastId`  
  _Permissions_: Only the toast's creator may list the invites of that toast

- **PUT** `/invites/:inviteId`  
  _Permissions_: Only the specified user may change the status of an invite they received

- **DELETE** `/invites/:inviteId`  
  _Permissions_: Only the sender may delete their own invite

- **POST** `/invites`  
  _Permissions_: A user may invite other users only to their own toasts

---

## 🍾 Toasts

- **GET** `/toasts`  
  _Permissions_: Admin only can retrieve all toasts

- **GET** `/toasts/:userId`  
  _Permissions_:

  - Regular user: may retrieve their own toasts
  - Admin: may retrieve toasts belonging to any user

- **GET** `/toasts/future-toasts/:userId`  
  _Permissions_: Only the specified user may retrieve their upcoming toasts (ones they host or were invited to and did not decline)

- **GET** `/toasts/current-period-toasts-amount`  
  _Permissions_: Any authenticated user may retrieve the count of toasts completed in the current period

- **GET** `/toasts/record`  
  _Permissions_: Any authenticated user may retrieve the record: the highest number of completed toasts in any previous half-year period

- **GET** `/toasts/waiting-for-approval`  
  _Permissions_: Admin only  
  Retrieves past toasts that are neither done nor accused

- **POST** `/toasts`  
  _Permissions_: Any authenticated user may create a toast for themselves (admins may create one for any user)  
  Body: `{ toast: {...}, invites: [userId, ...] }` - the toast and its invites are created together

- **PUT** `/toasts/:toastId`  
  _Permissions_:

  - Regular user: may update their own toast before its due time (fields: foods, drinks, reason, title, due time)
  - Admin: may update any toast at any time, including its `isDone` flag and its owner  
  Changing the due date resets every invite of the toast back to "pending"

- **DELETE** `/toasts/:toastId`  
  _Permissions_:
  - Regular user: may delete their own toast before its due time
  - Admin: may delete any toast at any time

---

## ⚠️ Accusations

- **GET** `/accusations/user/:userId`  
  _Permissions_:

  - Regular user: may view accusations filed against themselves
  - Admin: may view accusations filed against any user

- **GET** `/accusations/admin/:userId`  
  _Permissions_: Admin only  
  Retrieves accusations submitted by the given admin

- **POST** `/accusations/`  
  _Permissions_: Admin only  
  Files an accusation against the specified user. Exactly one of `crimeToastId` (a toast that was never held) or a free-text `reason` must be provided

- **DELETE** `/accusations/:accusationId`  
  _Permissions_: Admin only  
  Deletes the specified accusation (admins may delete any; if based on reason, only the original submitter may delete their own)
