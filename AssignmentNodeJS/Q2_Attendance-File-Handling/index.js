const fs = require('fs');
const path = require('path');
const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');

const filePath = path.join(__dirname, 'attendance.txt');

function readNames() {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  return fs
    .readFileSync(filePath, 'utf8')
    .split('\n')
    .map((name) => name.trim())
    .filter(Boolean);
}

function writeNames(names) {
  const content = names.length ? names.join('\n') + '\n' : '';
  fs.writeFileSync(filePath, content, 'utf8');
}

function findIndex(names, name) {
  return names.findIndex((entry) => entry.toLowerCase() === name.toLowerCase());
}

function addStudent(name) {
  const names = readNames();
  const trimmed = name.trim();

  if (!trimmed) {
    console.log('Error: name cannot be empty.');
    return;
  }
  if (findIndex(names, trimmed) !== -1) {
    console.log(`Error: ${trimmed} is already in the attendance list.`);
    return;
  }

  names.push(trimmed);
  writeNames(names);
  console.log(`Added ${trimmed} to the attendance list.`);
}

function showStudents() {
  const names = readNames();

  if (names.length === 0) {
    console.log('Attendance list is empty.');
    return;
  }

  console.log('Student attendance list:');
  names.forEach((name, index) => {
    console.log(`  ${index + 1}. ${name}`);
  });
}

function updateStudent(oldName, newName) {
  const names = readNames();
  const trimmed = newName.trim();
  const index = findIndex(names, oldName.trim());

  if (index === -1) {
    console.log(`Error: ${oldName.trim()} was not found in the attendance list.`);
    return;
  }
  if (!trimmed) {
    console.log('Error: new name cannot be empty.');
    return;
  }
  if (findIndex(names, trimmed) !== -1) {
    console.log(`Error: ${trimmed} is already in the attendance list.`);
    return;
  }

  const previous = names[index];
  names[index] = trimmed;
  writeNames(names);
  console.log(`Updated ${previous} to ${trimmed}.`);
}

function deleteStudent(name) {
  const names = readNames();
  const index = findIndex(names, name.trim());

  if (index === -1) {
    console.log(`Error: ${name.trim()} was not found in the attendance list.`);
    return;
  }

  const [removed] = names.splice(index, 1);
  writeNames(names);
  console.log(`Deleted ${removed} from the attendance list.`);
}

function runCommand(args) {
  const [command, first, second] = args;

  if (command === 'add' && first) {
    addStudent(first);
  } else if (command === 'show') {
    showStudents();
  } else if (command === 'update' && first && second) {
    updateStudent(first, second);
  } else if (command === 'delete' && first) {
    deleteStudent(first);
  } else {
    console.log('Usage:');
    console.log('  node index.js add "Name"');
    console.log('  node index.js show');
    console.log('  node index.js update "OldName" "NewName"');
    console.log('  node index.js delete "Name"');
    console.log('  node index.js            (interactive menu)');
  }
}

async function runMenu() {
  const rl = readline.createInterface({ input, output });

  console.log('Student Attendance List (file: attendance.txt)');

  try {
    while (true) {
      console.log('\n1. Add student');
      console.log('2. Show all students');
      console.log('3. Update student name');
      console.log('4. Delete student name');
      console.log('5. Exit');

      const choice = (await rl.question('Choose an option: ')).trim();

      if (choice === '1') {
        addStudent(await rl.question('Enter student name: '));
      } else if (choice === '2') {
        showStudents();
      } else if (choice === '3') {
        const oldName = await rl.question('Enter current name: ');
        const newName = await rl.question('Enter new name: ');
        updateStudent(oldName, newName);
      } else if (choice === '4') {
        deleteStudent(await rl.question('Enter name to delete: '));
      } else if (choice === '5') {
        console.log('Goodbye.');
        break;
      } else {
        console.log('Invalid option. Please choose 1-5.');
      }
    }
  } finally {
    rl.close();
  }
}

function main() {
  const args = process.argv.slice(2);

  if (args.length > 0) {
    runCommand(args);
  } else {
    runMenu();
  }
}

main();
