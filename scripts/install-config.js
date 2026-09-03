#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const os = require('os');

// ── Registro de configurações ──
// Cada entrada: nome, descrição, arquivos a copiar e o patch no settings.json.
// Adicione novas configurações aqui; os arquivos ficam em claude/.
const CONFIGS = [
  {
    name: 'statusline',
    description: 'Status line customizada: contexto, custo, tokens e velocidade de código.',
    files: [{ src: 'statusline.sh', dest: 'statusline.sh' }],
    settingsPatch(targetDir) {
      const abs = path.join(targetDir, 'statusline.sh').replace(/\\/g, '/');
      return { statusLine: { type: 'command', command: `bash "${abs}"` } };
    },
  },
  {
    name: 'beep',
    description: 'Alertas sonoros: bipe ao terminar (Stop) e ao pedir permissão.',
    files: [],
    settingsPatch() {
      return {
        hooks: {
          Stop: [
            {
              hooks: [
                {
                  type: 'command',
                  command: 'powershell -NoProfile -Command "[console]::beep(1000,250); [console]::beep(1400,300)"',
                },
              ],
            },
          ],
          Notification: [
            {
              matcher: 'permission_prompt',
              hooks: [
                {
                  type: 'command',
                  command: 'powershell -NoProfile -Command "[console]::beep(700,200); [console]::beep(500,300); [console]::beep(700,200)"',
                },
              ],
            },
          ],
        },
      };
    },
  },
];

const CONFIG_DIR = path.join(__dirname, '..', 'claude');

function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

// Merge profundo: objetos são fundidos (preservando chaves não citadas);
// arrays e demais valores são sobrescritos (idempotente).
function deepMerge(target, source) {
  const out = { ...target };
  for (const key of Object.keys(source)) {
    const s = source[key];
    const t = target[key];
    if (isPlainObject(s) && isPlainObject(t)) {
      out[key] = deepMerge(t, s);
    } else {
      out[key] = s;
    }
  }
  return out;
}

function listConfigs() {
  console.log('Configurações disponíveis:\n');
  for (const c of CONFIGS) {
    console.log(`  ${c.name.padEnd(14)} ${c.description}`);
  }
  console.log('\nUso:');
  console.log('  node scripts/install-config.js <config> [--global | --project]');
  console.log('  node scripts/install-config.js --config <config> [--global | --project]');
}

function usage() {
  console.log('Uso:');
  console.log('  node scripts/install-config.js --list              # lista as configs');
  console.log('  node scripts/install-config.js <config>            # instala (global por padrão)');
  console.log('  node scripts/install-config.js <config> --project  # instala no projeto atual');
  console.log('\nEscopo:');
  console.log('  --global  ~/.claude/ (todos os projetos) — padrão');
  console.log('  --project .claude/ do diretório atual');
}

// ── Parse de argumentos ──
const args = process.argv.slice(2);
let name = null;
let isProject = false;

for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--project' || a === '-p' || a === '--local') isProject = true;
  else if (a === '--global' || a === '-g') isProject = false;
  else if (a === '--config' || a === '-c') name = args[++i];
  else if (a === '--list' || a === 'list' || a === 'ls' || a === '-l') { listConfigs(); process.exit(0); }
  else if (a === '--help' || a === '-h' || a === 'help') { usage(); process.exit(0); }
  else name = a;
}

if (!name) {
  listConfigs();
  process.exit(0);
}

const config = CONFIGS.find((c) => c.name === name);
if (!config) {
  console.error(`❌ Configuração "${name}" não encontrada.`);
  listConfigs();
  process.exit(1);
}

// ── Diretório alvo ──
const targetDir = isProject
  ? path.join(process.cwd(), '.claude')
  : path.join(os.homedir(), '.claude');

const settingsPath = path.join(targetDir, 'settings.json');
fs.mkdirSync(targetDir, { recursive: true });

// 1. Copia os arquivos da config
for (const f of config.files) {
  const src = path.join(CONFIG_DIR, f.src);
  if (!fs.existsSync(src)) {
    console.error(`❌ ${f.src} não encontrado em claude/.`);
    process.exit(1);
  }
  fs.copyFileSync(src, path.join(targetDir, f.dest));
}

// 2. Merge do patch no settings.json (preserva o que já existe)
const settings = fs.existsSync(settingsPath)
  ? JSON.parse(fs.readFileSync(settingsPath, 'utf8').replace(/^﻿/, ''))
  : {};

const merged = deepMerge(settings, config.settingsPatch(targetDir));

fs.writeFileSync(settingsPath, JSON.stringify(merged, null, 2));

console.log(`✅ ${config.name} instalado (${isProject ? 'projeto' : 'global'}):`);
console.log(`   destino: ${targetDir}`);
console.log(`   config:  ${settingsPath}`);
console.log(`   escopo:  ${isProject ? '.claude/ (somente este projeto)' : '~/.claude/ (todos os projetos)'}`);
console.log('\nReinicie o Claude Code para aplicar.');
