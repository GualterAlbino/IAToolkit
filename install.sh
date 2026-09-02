#!/usr/bin/env bash
# Instala as skills deste repositório sem precisar clonar manualmente.
# Uso:
#   curl -fsSL https://raw.githubusercontent.com/GualterAlbino/ClaudeCodeSkills/master/install.sh | bash
#   curl -fsSL ... | bash -s nome-da-skill   # instala uma skill específica
set -euo pipefail

REPO="https://github.com/GualterAlbino/ClaudeCodeSkills.git"
TARGET="${1:-all}"

command -v git >/dev/null 2>&1 || { echo "❌ git não encontrado. Instale o git e tente novamente." >&2; exit 1; }
command -v node >/dev/null 2>&1 || { echo "❌ node não encontrado. Instale o Node.js e tente novamente." >&2; exit 1; }

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "⬇️  Baixando o repositório de skills..."
git clone --depth 1 "$REPO" "$TMP/repo"

echo "⚙️  Instalando as skills..."
node "$TMP/repo/scripts/install.js" "$TARGET"
