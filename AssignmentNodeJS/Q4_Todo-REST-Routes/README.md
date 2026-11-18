# Q4 - To-Do REST API (GET, POST, PUT, DELETE)

## Aim
Build an in-memory to-do API with Express exposing GET, POST, PUT and DELETE routes. Tasks are stored in a simple array, so no database is required.

## How to Run

```bash
cd Q4_Todo-REST-Routes
npm install
npm start
```

The API listens on `http://localhost:3000`.

## Code Overview

- Tasks are kept in the `tasks` array with an auto-incrementing `nextId`.
- `express.json()` parses JSON request bodies.
- `GET /tasks` returns all tasks; `POST /tasks` creates one with `completed: false`.
- `PUT /tasks/:id` marks a task completed; `DELETE /tasks/:id` removes it.
- Missing tasks return `404` and a missing title returns `400`.

## Sample Output

```text
GET    /tasks            -> []  (status 200)
POST   /tasks            -> {"id":1,"title":"Buy milk","completed":false}  (status 201)
PUT    /tasks/1          -> {"id":1,"title":"Buy milk","completed":true}   (status 200)
DELETE /tasks/1          -> {"message":"Task deleted.", ...}              (status 200)
```

Because tasks live in a simple array, restarting the server clears the list.
