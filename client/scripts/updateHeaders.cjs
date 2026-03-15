const fs = require('fs');
const path = require('path');

const dir = 'd:/new/Complaint_mern/src/client/src/components';
const files = fs.readdirSync(dir);

let count = 0;

for (const file of files) {
  if (file.endsWith('.jsx')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    const originalHeader = /<div\s+className="header-area"\s*(?:id="headerArea"\s*)?>/g;
    const newHeader = `<div className="header-area glass-nav" id="headerArea" style={{ position: 'sticky', top: 0, zIndex: 1000, padding: '1rem' }}>`;
    
    if (originalHeader.test(content)) {
      content = content.replace(originalHeader, newHeader);
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`Updated ${file}`);
      count++;
    }
  }
}

console.log(`Total files updated: ${count}`);
