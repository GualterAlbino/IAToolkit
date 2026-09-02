const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const skillsDir = path.join(__dirname, '..', 'skills');
let failed = false;

// 1. Valida o frontmatter de cada SKILL.md
const skills = fs.readdirSync(skillsDir).filter((dir) =>
  fs.statSync(path.join(skillsDir, dir)).isDirectory()
);

if (skills.length === 0) {
  console.error('❌ Nenhuma skill encontrada em skills/.');
  process.exit(1);
}

for (const name of skills) {
  const skillFile = path.join(skillsDir, name, 'SKILL.md');

  if (!fs.existsSync(skillFile)) {
    console.error(`❌ ${name}: arquivo SKILL.md ausente.`);
    failed = true;
    continue;
  }

  const content = fs.readFileSync(skillFile, 'utf8');
  // Tolerância a BOM e quebras de linha CRLF/LF
  const frontmatter = content.replace(/^﻿/, '').match(/^---\r?\n([\s\S]*?)\r?\n---/);

  if (!frontmatter) {
    console.error(`❌ ${name}: frontmatter ausente no SKILL.md.`);
    failed = true;
    continue;
  }

  const hasName = /^name:\s*\S+/m.test(frontmatter[1]);
  const hasDescription = /^description:\s*\S+/m.test(frontmatter[1]);

  if (!hasName) {
    console.error(`❌ ${name}: frontmatter sem "name".`);
    failed = true;
  }
  if (!hasDescription) {
    console.error(`❌ ${name}: frontmatter sem "description".`);
    failed = true;
  }
  if (hasName && hasDescription) {
    console.log(`✅ ${name}: SKILL.md válido.`);
  }
}

// 2. Valida a sintaxe dos scripts JS
for (const file of fs.readdirSync(__dirname)) {
  if (file.endsWith('.js')) {
    execSync(`node --check "${path.join(__dirname, file)}"`, { stdio: 'inherit' });
  }
}
console.log('✅ scripts/*.js: sintaxe válida.');

if (failed) {
  console.error('\n❌ Validação falhou.');
  process.exit(1);
}

console.log('\n✅ Validação concluída.');
