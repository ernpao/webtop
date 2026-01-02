// sass-builder.js (ES module version)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// import * as sass from 'sass';

// Required when using __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'src/components');
const mainFile = path.join(__dirname, 'src/components', 'styles.scss');
// const outputFile = path.join(__dirname, 'src/css', 'styles.min.css');

function generateMainScss() {
    const files = getScssFiles(srcDir);
    const imports = files
        .map(file => {
            const relative = path.relative(path.dirname(mainFile), file).replace(/\\/g, '/');
            return `@use './${relative.replace(/\.scss$/, '')}';`;
        })
        .join('\n');
    fs.writeFileSync(mainFile, imports);
    console.clear()
    console.log(`[${new Date().toLocaleTimeString()}] /src/components/styles.scss generated.`)
}

function getScssFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    return entries.flatMap(entry => {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) return getScssFiles(fullPath);
        if (entry.isFile() && entry.name.endsWith('.scss')) return fullPath;
        return [];
    }).filter(f => !f.endsWith('styles.scss'));
}

// function compileScss() {
//     try {
//         const result = sass.compile(mainFile, {
//             style: 'compressed'
//         });
//         fs.writeFileSync(outputFile, result.css);
//         console.log(`[${new Date().toLocaleTimeString()}] Compiled CSS`);
//     } catch (err) {
//         console.error('Sass error:', err.message);
//     }
// }

generateMainScss();
// compileScss();
