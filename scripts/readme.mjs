// Renders README.tex.md into README.md, turning $$…$$ and $…$ TeX into theme-aware SVGs under tex/.
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import MathJax from 'mathjax';

const SOURCE = 'README.tex.md';
const TARGET = 'README.md';
const DIR = 'tex';
// Glyphs use currentColor; this follows the viewer's light/dark preference (GitHub text colours).
const STYLE = '<style>svg{color:#1f2328}@media (prefers-color-scheme:dark){svg{color:#e6edf3}}</style>';
const HEADER = '<!-- Generated from README.tex.md by `yarn readme`. Edit README.tex.md instead. -->\n\n';

await MathJax.init({ loader: { load: ['input/tex', 'output/svg'] }, svg: { fontCache: 'local' } });
const adaptor = MathJax.startup.adaptor;
const written = new Set();

async function render(tex, display) {
  const name = createHash('md5').update(`${display}:${tex}`).digest('hex') + '.svg';
  const svg = adaptor.firstChild(await MathJax.tex2svgPromise(tex, { display }));
  adaptor.removeAttribute(svg, 'style');
  const xml = adaptor.outerHTML(svg).replace(/^<svg[^>]*>/, (open) => open + STYLE);
  writeFileSync(`${DIR}/${name}`, xml + '\n');
  written.add(name);
  const alt = tex
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;');
  const img = `<img src="/${DIR}/${name}" alt="${alt}" align="middle"/>`;
  return display ? `<p align="center">${img}</p>` : img;
}

async function renderMath(text) {
  const parts = text.split(/(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/);
  for (let i = 1; i < parts.length; i += 2) {
    const display = parts[i].startsWith('$$');
    parts[i] = await render(parts[i].slice(display ? 2 : 1, display ? -2 : -1).trim(), display);
  }
  return parts.join('');
}

// Fenced code blocks are copied verbatim.
const chunks = readFileSync(SOURCE, 'utf8').split(/(^```[\s\S]*?^```)/m);
for (let i = 0; i < chunks.length; i += 2) chunks[i] = await renderMath(chunks[i]);
writeFileSync(TARGET, HEADER + chunks.join(''));

for (const file of readdirSync(DIR)) if (!written.has(file)) unlinkSync(`${DIR}/${file}`);
console.log(`${TARGET}: ${written.size} formulas rendered into ${DIR}/`);
