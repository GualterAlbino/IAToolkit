const { execSync } = require('child_process');

// Configura o husky apenas quando existe um repositório git.
// Sem isso, `npx github:...` (que instala a partir de um tarball sem .git)
// falharia no prepare ao tentar configurar os hooks.
try {
  execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
  execSync('husky', { stdio: 'inherit' });
} catch {
  // sem .git — nada a fazer
}
