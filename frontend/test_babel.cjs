const fs = require('fs');
const babel = require('@babel/parser');

const content = fs.readFileSync('C:\\Users\\Atrik Samanta\\HRMS_Project\\frontend\\src\\pages\\Dashboard.tsx', 'utf8');

try {
    babel.parse(content, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript']
    });
    console.log('Successfully parsed!');
} catch (error) {
    console.error('Parse error at line', error.loc.line, 'col', error.loc.column);
    console.error(error.message);
}
