#!/bin/node

const fs = require('fs');
const readline = require('readline');

const EXTENSION_ID = "resistance-scanner@extension.js";

const manifestPath = './dist/firefox/manifest.json';
const fileStream = fs.createReadStream(manifestPath);
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity,
});

const lines = [];
let addedId = false;

rl.on('line', (line) => {
  if(line.trim().startsWith('"service_worker"')) {
    // "service_worker": "background/service_worker.js"
    line = line.replace('service_worker', 'scripts');
    const strStartIdx = line.indexOf(': "') + 2;
    line = line.substring(0, strStartIdx) + '[' + line.substring(strStartIdx) + ']';
    // "scripts": ["background/service_worker.js"]
  }

  lines.push(line);

  if(!addedId && line.trim() == "},") {
    lines.push(`  "browser_specific_settings":{"gecko": {"id": "${EXTENSION_ID}"}},`);
    addedId = true;
  }
});

rl.on('close', () => {
  lines.push('');
  fs.writeFileSync(manifestPath, lines.join('\n'));
})

