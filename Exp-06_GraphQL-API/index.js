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
