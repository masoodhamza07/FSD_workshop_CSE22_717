# Experiment 6: Basic GraphQL API

## Aim
To design, implement, and test a basic GraphQL API using Node.js, Express, and `graphql-http` to perform query and mutation operations on a student resource.

---

## Theory

### 1. What is GraphQL?
GraphQL is an open-source query language for APIs and a runtime for fulfilling those queries with existing data. Developed by Facebook in 2012 and open-sourced in 2015, GraphQL provides a complete and understandable description of the data in your API, giving clients the power to ask for exactly what they need and nothing more.

### 2. GraphQL vs REST

| Feature | REST API | GraphQL API |
| :--- | :--- | :--- |
| **Endpoint Architecture** | Multiple endpoints (`/students`, `/students/:id`, `/courses`) | Single flexible endpoint (usually `/graphql`) |
| **Data Fetching** | Fixed data structure defined by server; prone to **over-fetching** (receiving unnecessary fields) or **under-fetching** (needing multiple roundtrips) | Client specifies exact fields needed in the query request; avoids over/under-fetching |
| **Operations** | HTTP verbs determine action (`GET`, `POST`, `PUT`, `DELETE`) | Root operation types: `query` (read), `mutation` (write), `subscription` (real-time) |
| **Versioning** | Often requires URL versioning (e.g., `/api/v1`, `/api/v2`) | Evolves without versions by adding new fields and deprecating old ones |
| **Type System** | Typically untyped or relies on external OpenAPI/Swagger schemas | Strongly typed with Schema Definition Language (SDL) built-in |

### 3. Core Concepts in GraphQL

- **Schema Definition Language (SDL)**: The blueprint of a GraphQL API. It defines the types, operations, and relationships.
- **Types**:
  - **Scalar Types**: Primitive types including `Int`, `Float`, `String`, `Boolean`, and `ID`.
  - **Object Types**: Custom structured types (e.g., `Student`) with fields.
  - **Non-null modifier (`!`)**: Denotes that a field or argument is mandatory and will never be `null`.
- **Root Operation Types**:
  - **Query**: Read-only fetch operations (equivalent to `GET` in REST).
  - **Mutation**: Write operations that create, update, or delete data (equivalent to `POST`, `PUT`, `DELETE` in REST).
  - **Subscription**: Real-time event streams via WebSockets.
- **Resolvers**: Functions that produce the payload for a corresponding schema field. When a client executes a query or mutation, GraphQL executes the resolver function for each requested field.

---

## Architecture & Code Structure

```
Exp-06_GraphQL-API/
├── package.json        # Project metadata and dependencies (express, graphql, graphql-http)
├── index.js            # Express server, GraphQL schema, resolvers, and route mounting
└── README.md           # Documentation, theory, guide, and testing examples
```

### Modern Approach vs Legacy `express-graphql`
- **Modern standard**: The official GraphQL foundation recommends using [`graphql-http`](https://github.com/graphql/graphql-http) for HTTP server bindings as it adheres to the latest GraphQL over HTTP specification.
- **Legacy approach**: `express-graphql` was historically popular and used `graphqlHTTP({ schema, rootValue, graphiql: true })`. Both approaches follow the same schema and resolver design patterns.

---

## Prerequisites & Installation

1. Ensure **Node.js** (v16+) and **npm** are installed.
2. Navigate to the experiment directory:
   ```bash
   cd Exp-06_GraphQL-API
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

---

## Running the Application

Start the server using:
```bash
npm start
```
Or directly with Node:
```bash
node index.js
```

### Console Output:
```text
====================================================
🚀 Experiment 6 GraphQL Server is running!
📡 URL: http://localhost:4000/
🎯 GraphQL Endpoint: http://localhost:4000/graphql
====================================================
```

---

## Testing the GraphQL API

GraphQL requests are sent as HTTP `POST` requests to `http://localhost:4000/graphql` with a JSON body:
```json
{
  "query": "..."
}
```

You can test this using **Postman**, **Insomnia**, or **cURL**.

---

### 1. Query: Fetch All Students

#### cURL Command:
```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query { students { id name age course } }"}'
```

#### Expected Output:
```json
{
  "data": {
    "students": [
      {
        "id": "1",
        "name": "Alice Johnson",
        "age": 20,
        "course": "Computer Science"
      },
      {
        "id": "2",
        "name": "Bob Smith",
        "age": 22,
        "course": "Information Technology"
      },
      {
        "id": "3",
        "name": "Charlie Brown",
        "age": 21,
        "course": "Data Science"
      }
    ]
  }
}
```
