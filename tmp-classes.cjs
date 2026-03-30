const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.jsx')) {
            results.push(file);
        }
    });
    return results;
}

const classes = new Set();
walk('c:/Users/siddh/.gemini/antigravity/playground/sparse-whirlpool/src').forEach(f => {
    const content = fs.readFileSync(f, 'utf8');
    // regex for className="..." or className={'...'}
    const r1 = content.match(/className="([^"]+)"/g);
    if(r1) r1.forEach(m => {
        const cList = m.match(/className="([^"]+)"/)[1].split(/\s+/);
        cList.forEach(c => { if(c) classes.add(c); });
    });
    // extract from template literals className={`...`}
    const r2 = content.match(/className=\{`([^`]+)`\}/g);
    if(r2) r2.forEach(m => {
        const cList = m.match(/className=\{`([^`]+)`\}/)[1].split(/\s+/);
        cList.forEach(c => { if(c && !c.includes('${')) classes.add(c); });
    });
});
console.log(Array.from(classes).join(' '));
