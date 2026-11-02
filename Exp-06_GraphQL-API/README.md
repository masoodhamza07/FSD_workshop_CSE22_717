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
