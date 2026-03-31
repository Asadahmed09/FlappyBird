const fs = require('fs');
const path = require('path');

const basePath = process.cwd();

const dirs = [
  'src',
  'src/components',
  'src/components/Game',
  'src/components/UI',
  'src/components/Layout',
  'src/hooks',
  'src/contexts',
  'src/utils',
  'src/types'
];

dirs.forEach(dir => {
  const fullPath = path.join(basePath, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created: ${fullPath}`);
  } else {
    console.log(`Already exists: ${fullPath}`);
  }
});

console.log('\nDirectory structure created successfully!');
