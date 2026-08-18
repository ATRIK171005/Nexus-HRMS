const fs = require('fs');
const content = fs.readFileSync('C:\\Users\\Atrik Samanta\\HRMS_Project\\frontend\\src\\pages\\Dashboard.tsx', 'utf8');

// extract the return statement of Dashboard
const returnStart = content.indexOf('return (');
const returnEnd = content.lastIndexOf(');');

const returnContent = content.substring(returnStart, returnEnd);

let depth = 0;
let pos = 0;

while (pos < returnContent.length) {
    let openIndex = returnContent.indexOf('<div', pos);
    let closeIndex = returnContent.indexOf('</div', pos);
    
    if (openIndex === -1 && closeIndex === -1) break;
    
    if (openIndex !== -1 && (closeIndex === -1 || openIndex < closeIndex)) {
        // found open div
        let endOfTag = returnContent.indexOf('>', openIndex);
        if (returnContent[endOfTag - 1] === '/') {
            // self closing
        } else {
            depth++;
        }
        pos = endOfTag + 1;
    } else if (closeIndex !== -1) {
        // found close div
        depth--;
        if (depth < 0) {
            console.log('UNMATCHED CLOSE DIV AT INDEX', closeIndex, returnContent.substring(Math.max(0, closeIndex - 50), closeIndex + 20));
            break;
        }
        pos = closeIndex + 6;
    }
}
console.log('Final depth:', depth);
