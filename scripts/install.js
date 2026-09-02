const fs = require('fs');
const path = require('path');
const os = require('os');

// Alvo: nome da skill, ou 'all' para instalar todas
const target = process.argv[2] || 'all';

const skillsDir = path.join(__dirname, '..', 'skills');
const destDir = path.join(os.homedir(), '.claude', 'skills');

// Lista as skills disponíveis no repositório (pastas que contêm SKILL.md)
const availableSkills = fs.readdirSync(skillsDir).filter((item) => {
  const full = path.join(skillsDir, item);
  return fs.statSync(full).isDirectory() && fs.existsSync(path.join(full, 'SKILL.md'));
});

if (availableSkills.length === 0) {
  console.error('❌ Nenhuma skill encontrada em skills/.');
  process.exit(1);
}

// Determina quais instalar
const toInstall = target === 'all' ? availableSkills : [target];

toInstall.forEach((name) => {
  const src = path.join(skillsDir, name);
  const dest = path.join(destDir, name);

  if (!fs.existsSync(path.join(src, 'SKILL.md'))) {
    console.error(`❌ Skill "${name}" não encontrada.`);
    console.log(`   Disponíveis: ${availableSkills.join(', ')}`);
    process.exit(1);
  }

  // Copia a skill para ~/.claude/skills/ (substituindo a versão anterior)
  fs.mkdirSync(destDir, { recursive: true });
  fs.rmSync(dest, { recursive: true, force: true });
  fs.cpSync(src, dest, { recursive: true });

  console.log(`✅ "${name}" instalada em ${dest}`);
});

console.log('\n🚀 Pronto! Reinicie o Claude Code para carregar as skills instaladas.');
