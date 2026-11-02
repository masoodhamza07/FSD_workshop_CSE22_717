/**
 * Experiment 6: Basic GraphQL API
 * 
 * Aim: Set up a basic GraphQL API using Express and graphql-http.
 * Demonstrates:
 *  - GraphQL Schema Definition (Types, Query, Mutation)
 *  - Resolvers for fetching and mutating data
 *  - In-memory data store for students
 *  - Mounting GraphQL handler on an Express application
 */

const express = require('express');
const { buildSchema } = require('graphql');
const { createHandler } = require('graphql-http/lib/use/express');

// ============================================================================
// Alternative: Traditional express-graphql approach (for reference)
// ============================================================================
// const { graphqlHTTP } = require('express-graphql');
// 
// app.use('/graphql', graphqlHTTP({
//   schema: schema,
//   rootValue: root,
//   graphiql: true // Built-in interactive browser UI
// }));
// ============================================================================

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware to parse incoming JSON (optional for custom routes, graphql-http handles its own)
app.use(express.json());

// ----------------------------------------------------------------------------
// 1. In-Memory Data Store
// ----------------------------------------------------------------------------
let students = [
  { id: '1', name: 'Alice Johnson', age: 20, course: 'Computer Science' },
  { id: '2', name: 'Bob Smith', age: 22, course: 'Information Technology' },
  { id: '3', name: 'Charlie Brown', age: 21, course: 'Data Science' }
];

let nextId = 4;
