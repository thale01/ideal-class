const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            results = results.concat(walk(fullPath));
        } else if (file.endsWith('.jsx')) {
            results.push(fullPath);
        }
    });
    return results;
}

const allClasses = new Set();
walk('c:/Users/siddh/.gemini/antigravity/playground/sparse-whirlpool/src').forEach(f => {
    const content = fs.readFileSync(f, 'utf8');
    const regex = /className(?:Name)?=\s*(?:\"([^"]+)\"|\{`([^`]+)`\}|\{'([^']+)'\}|\{"([^"]+)"\})/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        let clsString = match[1] || match[2] || match[3] || match[4];
        if(!clsString) continue;
        const classes = clsString.split(/\s+/);
        classes.forEach(c => {
            if(c && !c.includes('$')) { 
                allClasses.add(c.trim());
            }
        });
    }
});

let css = `/* Generic Layout Utilities */
.container {
  width: 100% !important;
  max-width: 1200px !important;
  margin-left: auto !important;
  margin-right: auto !important;
  padding-left: 1.5rem !important;
  padding-right: 1.5rem !important;
}
.text-grad {
  background: var(--grad-main);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
`;
let smCss = `\n@media (min-width: 640px) {\n`;
let mdCss = `\n@media (min-width: 768px) {\n`;
let lgCss = `\n@media (min-width: 1024px) {\n`;

const colors = {
    'primary': 'var(--primary)',
    'alt': 'var(--bg-alt)',
    'main': 'var(--bg-main)',
    'surface': 'var(--bg-surface)',
    'white': '#ffffff',
    'black': '#000000',
    'dim': 'var(--text-dim)',
    'bright': 'var(--text-bright)',
    'accent': 'var(--accent)',
    'success': 'var(--success)',
    'danger': 'var(--danger)',
    'warning': 'var(--warning)',
    'transparent': 'transparent'
};

function cssText(c) {
    let raw = c;
    let bp = '';
    if(c.startsWith('sm:')) { bp = 'sm'; c = c.slice(3); }
    if(c.startsWith('md:')) { bp = 'md'; c = c.slice(3); }
    if(c.startsWith('lg:')) { bp = 'lg'; c = c.slice(3); }
    
    if(c.includes(':')) return; 

    let rules = '';

    if(c==='flex') rules = 'display: flex !important;';
    else if(c==='inline-flex') rules = 'display: inline-flex !important;';
    else if(c==='grid') rules = 'display: grid !important;';
    else if(c==='block') rules = 'display: block !important;';
    else if(c==='inline-block') rules = 'display: inline-block !important;';
    else if(c==='hidden') rules = 'display: none !important;';
    else if(c==='flex-col') rules = 'flex-direction: column !important;';
    else if(c==='flex-row') rules = 'flex-direction: row !important;';
    else if(c==='flex-1') rules = 'flex: 1 1 0% !important;';
    else if(c==='flex-wrap') rules = 'flex-wrap: wrap !important;';
    else if(c.startsWith('grid-cols-')) rules = `grid-template-columns: repeat(${c.split('-')[2]}, minmax(0, 1fr)) !important;`;
    else if(c.startsWith('col-span-')) rules = `grid-column: span ${c.split('-')[2]} / span ${c.split('-')[2]} !important;`;

    else if(c==='items-center') rules = 'align-items: center !important;';
    else if(c==='items-start') rules = 'align-items: flex-start !important;';
    else if(c==='items-end') rules = 'align-items: flex-end !important;';
    else if(c==='justify-center') rules = 'justify-content: center !important;';
    else if(c==='justify-between') rules = 'justify-content: space-between !important;';
    else if(c==='justify-start') rules = 'justify-content: flex-start !important;';
    else if(c==='justify-end') rules = 'justify-content: flex-end !important;';
    else if(c==='text-center') rules = 'text-align: center !important;';
    else if(c==='text-left') rules = 'text-align: left !important;';
    else if(c==='text-right') rules = 'text-align: right !important;';

    else if(c==='relative') rules = 'position: relative !important;';
    else if(c==='absolute') rules = 'position: absolute !important;';
    else if(c==='fixed') rules = 'position: fixed !important;';
    else if(c==='sticky') rules = 'position: sticky !important;';
    else if(c==='inset-0') rules = 'top: 0; right: 0; bottom: 0; left: 0 !important;';
    else if(c==='top-0') rules = 'top: 0 !important;';
    else if(c==='bottom-0') rules = 'bottom: 0 !important;';
    else if(c==='left-0') rules = 'left: 0 !important;';
    else if(c==='right-0') rules = 'right: 0 !important;';
    else if(c==='top-1/2') rules = 'top: 50% !important;';
    else if(c==='left-1/2') rules = 'left: 50% !important;';
    else if(c==='-translate-y-1/2') rules = 'transform: translateY(-50%) !important;';
    else if(c==='-translate-x-1/2') rules = 'transform: translateX(-50%) !important;';
    else if(c==='z-10') rules = 'z-index: 10 !important;';
    else if(c==='z-20') rules = 'z-index: 20 !important;';
    else if(c==='z-30') rules = 'z-index: 30 !important;';
    else if(c==='z-40') rules = 'z-index: 40 !important;';
    else if(c==='z-50') rules = 'z-index: 50 !important;';

    else if(c.startsWith('gap-')) rules = `gap: ${c.split('-')[1]*0.25}rem !important;`;
    else if(c.match(/^p[xy]?-/)) {
        let v = parseInt(c.split('-')[1]);
        if(isNaN(v)) return;
        let val = (v*0.25)+'rem !important';
        if(c.startsWith('px-')) rules = `padding-left: ${val}; padding-right: ${val};`;
        else if(c.startsWith('py-')) rules = `padding-top: ${val}; padding-bottom: ${val};`;
        else if(c.startsWith('pt-')) rules = `padding-top: ${val};`;
        else if(c.startsWith('pb-')) rules = `padding-bottom: ${val};`;
        else if(c.startsWith('pl-')) rules = `padding-left: ${val};`;
        else if(c.startsWith('pr-')) rules = `padding-right: ${val};`;
        else if(c.startsWith('p-')) rules = `padding: ${val};`;
    }
    else if(c.match(/^m[xy]?-/)) {
        if(c.endsWith('auto')) {
            if(c==='mx-auto') rules = 'margin-left: auto !important; margin-right: auto !important;';
            if(c==='my-auto') rules = 'margin-top: auto !important; margin-bottom: auto !important;';
        } else {
            let m = c.match(/^(-?)m([xytrbl]?)-(\d+)$/);
            if(m) {
                let isNeg = m[1] === '-';
                let dir = m[2];
                let val = (isNeg ? '-' : '') + (parseInt(m[3])*0.25) + 'rem !important';
                if(dir==='x') rules = `margin-left: ${val}; margin-right: ${val};`;
                else if(dir==='y') rules = `margin-top: ${val}; margin-bottom: ${val};`;
                else if(dir==='t') rules = `margin-top: ${val};`;
                else if(dir==='b') rules = `margin-bottom: ${val};`;
                else if(dir==='l') rules = `margin-left: ${val};`;
                else if(dir==='r') rules = `margin-right: ${val};`;
                else if(dir==='') rules = `margin: ${val};`;
            }
        }
    }

    else if(c==='w-full') rules = 'width: 100% !important;';
    else if(c==='h-full') rules = 'height: 100% !important;';
    else if(c==='min-h-screen') rules = 'min-height: 100vh !important;';
    else if(c==='w-fit') rules = 'width: fit-content !important;';
    else if(c==='h-fit') rules = 'height: fit-content !important;';
    else if(c.match(/^w-\d+$/)) rules = `width: ${parseInt(c.split('-')[1])*0.25}rem !important;`;
    else if(c.match(/^h-\d+$/)) rules = `height: ${parseInt(c.split('-')[1])*0.25}rem !important;`;
    else if(c.match(/^max-w-/)) {
        if(c==='max-w-xs') rules = 'max-width: 20rem !important;';
        else if(c==='max-w-sm') rules = 'max-width: 24rem !important;';
        else if(c==='max-w-md') rules = 'max-width: 28rem !important;';
        else if(c==='max-w-lg') rules = 'max-width: 32rem !important;';
        else if(c==='max-w-xl') rules = 'max-width: 36rem !important;';
        else if(c==='max-w-2xl') rules = 'max-width: 42rem !important;';
        else if(c==='max-w-3xl') rules = 'max-width: 48rem !important;';
        else if(c==='max-w-4xl') rules = 'max-width: 56rem !important;';
        else if(c==='max-w-full') rules = 'max-width: 100% !important;';
        else if(c.includes('[') && c.includes(']')) rules = `max-width: ${c.substring(c.indexOf('[')+1, c.indexOf(']'))} !important;`;
    }

    else if(c==='font-bold') rules = 'font-weight: 700 !important;';
    else if(c==='font-black') rules = 'font-weight: 900 !important;';
    else if(c==='font-medium') rules = 'font-weight: 500 !important;';
    else if(c==='font-800') rules = 'font-weight: 800 !important;';
    else if(c==='font-700') rules = 'font-weight: 700 !important;';
    else if(c==='font-600') rules = 'font-weight: 600 !important;';
    else if(c==='font-900') rules = 'font-weight: 900 !important;';
    else if(c==='italic') rules = 'font-style: italic !important;';
    else if(c==='uppercase') rules = 'text-transform: uppercase !important;';
    else if(c==='tracking-tight') rules = 'letter-spacing: -0.025em !important;';
    else if(c==='tracking-widest') rules = 'letter-spacing: 0.1em !important;';
    else if(c==='leading-none') rules = 'line-height: 1 !important;';
    else if(c==='leading-tight') rules = 'line-height: 1.25 !important;';
    else if(c==='leading-relaxed') rules = 'line-height: 1.625 !important;';
    else if(c==='whitespace-nowrap') rules = 'white-space: nowrap !important;';
    else if(c==='text-xs') rules = 'font-size: 0.75rem !important; line-height: 1rem !important;';
    else if(c==='text-sm') rules = 'font-size: 0.875rem !important; line-height: 1.25rem !important;';
    else if(c==='text-base') rules = 'font-size: 1rem !important; line-height: 1.5rem !important;';
    else if(c==='text-lg') rules = 'font-size: 1.125rem !important; line-height: 1.75rem !important;';
    else if(c==='text-xl') rules = 'font-size: 1.25rem !important; line-height: 1.75rem !important;';
    else if(c==='text-2xl') rules = 'font-size: 1.5rem !important; line-height: 2rem !important;';
    else if(c==='text-3xl') rules = 'font-size: 1.875rem !important; line-height: 2.25rem !important;';
    else if(c==='text-4xl') rules = 'font-size: 2.25rem !important; line-height: 2.5rem !important;';
    else if(c==='text-5xl') rules = 'font-size: 3rem !important; line-height: 1 !important;';
    else if(c==='text-6xl') rules = 'font-size: 3.75rem !important; line-height: 1 !important;';
    else if(c==='text-7xl') rules = 'font-size: 4.5rem !important; line-height: 1 !important;';
    else if(c==='text-[10px]') rules = 'font-size: 10px !important;';

    else if(c==='rounded-full') rules = 'border-radius: 9999px !important;';
    else if(c==='rounded-none') rules = 'border-radius: 0px !important;';
    else if(c==='rounded-sm') rules = 'border-radius: 0.125rem !important;';
    else if(c==='rounded') rules = 'border-radius: 0.25rem !important;';
    else if(c==='rounded-md') rules = 'border-radius: 0.375rem !important;';
    else if(c==='rounded-lg') rules = 'border-radius: 0.5rem !important;';
    else if(c==='rounded-xl') rules = 'border-radius: 0.75rem !important;';
    else if(c==='rounded-2xl') rules = 'border-radius: 1rem !important;';
    else if(c==='rounded-3xl') rules = 'border-radius: 1.5rem !important;';
    else if(c==='border') rules = 'border-width: 1px !important;';
    else if(c==='border-none') rules = 'border-width: 0 !important;';
    else if(c==='border-t') rules = 'border-top-width: 1px !important;';
    else if(c==='border-b') rules = 'border-bottom-width: 1px !important;';
    else if(c==='border-l') rules = 'border-left-width: 1px !important;';
    else if(c==='border-r') rules = 'border-right-width: 1px !important;';

    else if(c==='shadow-sm') rules = 'box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05) !important;';
    else if(c==='shadow') rules = 'box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06) !important;';
    else if(c==='shadow-md') rules = 'box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1) !important;';
    else if(c==='shadow-lg') rules = 'box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1) !important;';
    else if(c==='shadow-xl') rules = 'box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1) !important;';
    else if(c==='shadow-2xl') rules = 'box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25) !important;';
    else if(c==='shadow-inner') rules = 'box-shadow: inset 0 2px 4px 0 rgba(0,0,0,0.06) !important;';
    else if(c==='opacity-10') rules = 'opacity: 0.1 !important;';
    else if(c==='opacity-20') rules = 'opacity: 0.2 !important;';
    else if(c==='opacity-30') rules = 'opacity: 0.3 !important;';
    else if(c==='opacity-40') rules = 'opacity: 0.4 !important;';
    else if(c==='opacity-50') rules = 'opacity: 0.5 !important;';
    else if(c==='opacity-60') rules = 'opacity: 0.6 !important;';
    else if(c==='opacity-70') rules = 'opacity: 0.7 !important;';
    else if(c==='opacity-80') rules = 'opacity: 0.8 !important;';
    else if(c==='opacity-90') rules = 'opacity: 0.9 !important;';
    else if(c==='opacity-100') rules = 'opacity: 1 !important;';
    else if(c==='cursor-pointer') rules = 'cursor: pointer !important;';
    else if(c==='cursor-not-allowed') rules = 'cursor: not-allowed !important;';
    else if(c==='overflow-hidden') rules = 'overflow: hidden !important;';
    else if(c==='overflow-y-auto') rules = 'overflow-y: auto !important;';
    else if(c==='transition-all') rules = 'transition: all 0.3s !important;';
    else if(c==='transition-colors') rules = 'transition: color 0.3s, background-color 0.3s, border-color 0.3s !important;';

    else if(c.startsWith('text-')) {
        let n = c.split('-')[1];
        if(colors[n]) rules = `color: ${colors[n]} !important;`;
        else if (n === 'blue') rules = 'color: #3b82f6 !important;';
        else if (n === 'purple') rules = 'color: #a855f7 !important;';
        else if (n === 'green') rules = 'color: #22c55e !important;';
        else if (n === 'red') rules = 'color: #ef4444 !important;';
    }
    else if(c.startsWith('bg-')) {
        let n = c.split('-')[1];
        if(colors[n]) rules = `background-color: ${colors[n]} !important;`;
        else if (n === 'blue') rules = 'background-color: #3b82f6 !important;';
        else if (n === 'purple') rules = 'background-color: #a855f7 !important;';
        else if (n === 'green') rules = 'background-color: #22c55e !important;';
        else if (n === 'red') rules = 'background-color: #ef4444 !important;';
        else if (n === 'transparent') rules = 'background-color: transparent !important;';
    }
    else if(c.startsWith('border-')) {
        let n = c.split('-')[1];
        if(colors[n]) rules = `border-color: ${colors[n]} !important;`;
        else if (n === 'subtle') rules = 'border-color: var(--border-subtle) !important;';
    }

    if(rules) {
        const escapedClass = raw.replace(/[:\/\[\]\.]/g, '\\$&');
        const r = `.${escapedClass} { ${rules} }\n`;
        if(bp==='sm') smCss += r;
        else if(bp==='md') mdCss += r;
        else if(bp==='lg') lgCss += r;
        else css += r;
    }
}

Array.from(allClasses).forEach(cssText);
const out = css + smCss + '}\n' + mdCss + '}\n' + lgCss + '}\n';
fs.writeFileSync('c:/Users/siddh/.gemini/antigravity/playground/sparse-whirlpool/src/utilities.css', out);
