const fs = require('fs');
const path = require('path');

const dirs = [
    'src/components/Game',
    'src/components/UI',
    'src/components/Layout',
    'src/hooks',
    'src/contexts',
    'src/utils',
    'src/types'
];

dirs.forEach(dir => {
    const fullPath = path.join(__dirname, dir);
    fs.mkdirSync(fullPath, { recursive: true });
});

console.log('Directories created');
