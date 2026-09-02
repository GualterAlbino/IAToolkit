const fs = require('fs');
const path = require('path');
const os = require('os');

// Argumentos: nomes de skills, "all", ou "list"
const args = process.argv.slice(2);

const skillsDir = path.join(__dirname, '..', 'skills');
const destDir = path.join(os.homedir(), '.claude', 'skills');

// Lista as skills disponíveis no repositório (pastas que contêm SKILL.md)
const availableSkills = fs.readdirSync(skillsDir).filter((item) => {
  const full = path.join(skillsDir, item);
  return fs.statSync(full).isDirectory() && fs.existsSync(path.join(full, 'SKILL.md'));
});

// Ação "list": mostra as skills disponíveis
if (args[0] === 'list' || args[0] === '--list' || args[0] === 'ls') {
  if (availableSkills.length === 0) {
    console.log('Nenhuma skill disponível.');
  } else {
    console.log('Skills disponíveis:');
    availableSkills.forEach((name) => console.log(`  • ${name}`));
  }
  process.exit(0);
}

// Sem argumento ou "all" → instala todas; senão, instala as indicadas
const targets = args.length === 0 || args.includes('all') ? availableSkills : args;

// Valida nomes desconhecidos
const unknown = targets.filter((t) => !availableSkills.includes(t));
if (unknown.length > 0) {
  console.error(`❌ Skill(s) não encontrada(s): ${unknown.join(', ')}`);
  console.log(`   Disponíveis: ${availableSkills.join(', ')}`);
  process.exit(1);
}

targets.forEach((name) => {
  const src = path.join(skillsDir, name);
  const dest = path.join(destDir, name);

  // Copia a skill para ~/.claude/skills/ (substituindo a versão anterior)
  fs.mkdirSync(destDir, { recursive: true });
  fs.rmSync(dest, { recursive: true, force: true });
  fs.cpSync(src, dest, { recursive: true });

  console.log(`✅ "${name}" instalada em ${dest}`);
});

console.log('\n🚀 Pronto! Reinicie o Claude Code para carregar as skills instaladas.');
