# Q2 - Student Attendance List (fs Module)

## Aim
Maintain a student attendance list in `attendance.txt` using the Node.js `fs` module: add a name, show all names, update a name and delete a name.

## How to Run

```bash
cd Q2_Attendance-File-Handling
node index.js
```

Use the interactive menu, or run a single operation directly:

```bash
node index.js add "Alice"
node index.js show
node index.js update "Alice" "Alicia"
node index.js delete "Alicia"
```

## Code Overview

- `readNames()` and `writeNames()` use `fs.readFileSync` and `fs.writeFileSync` on `attendance.txt`.
- `addStudent`, `showStudents`, `updateStudent` and `deleteStudent` implement the four operations.
- Matching is case-insensitive, and duplicate or empty names are rejected.
- `readline/promises` drives the menu; command-line arguments allow one-shot commands.

## Sample Output

```text
Added Alice to the attendance list.
Added Bob to the attendance list.
Updated Bob to Robert.
Deleted Alice from the attendance list.
Student attendance list:
  1. Robert
```

The names are persisted in `attendance.txt`, one name per line.
