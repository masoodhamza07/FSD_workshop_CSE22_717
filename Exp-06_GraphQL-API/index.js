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

// ----------------------------------------------------------------------------
// 2. GraphQL Schema Definition (SDL)
// ----------------------------------------------------------------------------
// Defines types, available queries, and mutations.
const schema = buildSchema(`
  # Student entity representing a workshop participant
  type Student {
    id: ID!
    name: String!
    age: Int!
    course: String!
  }

  # Root Query: Read operations
  type Query {
    # Fetch all students
    students: [Student!]!
    
    # Fetch a single student by unique ID
    student(id: ID!): Student
  }

  # Root Mutation: Create, Update, Delete operations
  type Mutation {
    # Add a new student
    addStudent(name: String!, age: Int!, course: String!): Student!
    
    # Update an existing student's details
    updateStudent(id: ID!, name: String, age: Int, course: String): Student
    
    # Delete a student by ID
    deleteStudent(id: ID!): String!
  }
`);

// ----------------------------------------------------------------------------
// 3. Root Resolvers
// ----------------------------------------------------------------------------
// Resolvers provide the logic to fulfill GraphQL queries and mutations.
const root = {
  // Query: Get all students
  students: () => {
    console.log('[GraphQL Query] Fetching all students');
    return students;
  },

  // Query: Get single student by ID
  student: ({ id }) => {
    console.log(`[GraphQL Query] Fetching student with ID: ${id}`);
    const student = students.find((s) => s.id === id);
    if (!student) {
      throw new Error(`Student with ID "${id}" not found.`);
    }
    return student;
  },

  // Mutation: Add new student
  addStudent: ({ name, age, course }) => {
    console.log(`[GraphQL Mutation] Adding new student: ${name}`);
    
    // Basic validation
    if (!name || name.trim() === '') {
      throw new Error('Name is required and cannot be empty.');
    }
    if (age <= 0) {
      throw new Error('Age must be a positive integer.');
    }
    if (!course || course.trim() === '') {
      throw new Error('Course is required and cannot be empty.');
    }

    const newStudent = {
      id: String(nextId++),
      name: name.trim(),
      age: Number(age),
      course: course.trim()
    };

    students.push(newStudent);
    return newStudent;
  },

  // Mutation: Update existing student
  updateStudent: ({ id, name, age, course }) => {
    console.log(`[GraphQL Mutation] Updating student with ID: ${id}`);
    const studentIndex = students.findIndex((s) => s.id === id);
    
    if (studentIndex === -1) {
      throw new Error(`Student with ID "${id}" not found.`);
    }

    const current = students[studentIndex];
    const updatedStudent = {
      ...current,
      name: name !== undefined && name.trim() !== '' ? name.trim() : current.name,
      age: age !== undefined && age > 0 ? Number(age) : current.age,
      course: course !== undefined && course.trim() !== '' ? course.trim() : current.course
    };

    students[studentIndex] = updatedStudent;
    return updatedStudent;
  },

  // Mutation: Delete student by ID
  deleteStudent: ({ id }) => {
    console.log(`[GraphQL Mutation] Deleting student with ID: ${id}`);
    const studentIndex = students.findIndex((s) => s.id === id);
    
    if (studentIndex === -1) {
      throw new Error(`Student with ID "${id}" not found.`);
    }

    const deleted = students.splice(studentIndex, 1)[0];
    return `Student "${deleted.name}" (ID: ${id}) deleted successfully.`;
  }
};

// ----------------------------------------------------------------------------
// 4. Mount GraphQL Endpoint
// ----------------------------------------------------------------------------
// Use graphql-http createHandler as the modern recommended middleware
app.all('/graphql', createHandler({
  schema: schema,
  rootValue: root
}));

// Provide a friendly landing page at root with instructions & query examples
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Experiment 6: Basic GraphQL API</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 40px; line-height: 1.6; color: #333; }
        h1 { color: #2e7d32; }
        code, pre { background: #f4f4f4; padding: 4px 8px; border-radius: 4px; font-family: Menlo, Monaco, Consolas, monospace; }
        pre { padding: 16px; overflow-x: auto; }
        .badge { display: inline-block; padding: 4px 10px; background: #e0f2fe; color: #0284c7; border-radius: 9999px; font-size: 12px; font-weight: bold; }
        ul { padding-left: 20px; }
      </style>
    </head>
    <body>
      <span class="badge">GraphQL API Active</span>
      <h1>🎓 Experiment 6: Basic GraphQL API Server</h1>
      <p>The GraphQL endpoint is available at <code>POST /graphql</code>.</p>
      
      <h2>How to Query this Endpoint:</h2>
      <p>Send a POST request with JSON payload <code>{ "query": "..." }</code>.</p>
      
      <h3>Example curl command:</h3>
      <pre>curl -X POST http://localhost:${PORT}/graphql \\
  -H "Content-Type: application/json" \\
  -d '{"query": "{ students { id name age course } }"}'</pre>

      <h3>Available Operations:</h3>
      <ul>
        <li><strong>Query:</strong> <code>students</code> (list all), <code>student(id: "1")</code> (get one)</li>
        <li><strong>Mutation:</strong> <code>addStudent</code>, <code>updateStudent</code>, <code>deleteStudent</code></li>
      </ul>
      <p>Refer to <code>README.md</code> for complete sample queries, mutations, and testing steps.</p>
    </body>
    </html>
  `);
});
