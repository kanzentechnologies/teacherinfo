import fs from 'fs';
import path from 'path';

const libDir = path.join(process.cwd(), 'lib');
const files = fs.readdirSync(libDir).filter(f => f.endsWith('Store.ts'));

for (const file of files) {
  const filePath = path.join(libDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(/console\.error\('Error fetching data:', error\.message \|\| error\);\n\s*return cached/g, "console.error('Error fetching data:', error.message || error);\n    return cached");

  content = content.replace(/if \(error\) \{\n\s*console\.error\('Error fetching data:', error\.message \|\| error\);\n\s*\}/g, "if (error) {\n    console.error('Error in write:', error.message || error);\n    throw new Error(error.message || 'Write error');\n  }");

  fs.writeFileSync(filePath, content);
}
console.log('Fixed stores.');
