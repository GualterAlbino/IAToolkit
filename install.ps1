# Instala as skills deste repositório sem precisar clonar manualmente.
# Uso (PowerShell):
#   irm https://raw.githubusercontent.com/GualterAlbino/ClaudeCodeSkills/master/install.ps1 | iex
$ErrorActionPreference = "Stop"

$repo = "https://github.com/GualterAlbino/ClaudeCodeSkills.git"
$target = "all"
if ($null -ne $args -and $args.Count -gt 0) { $target = $args[0] }

if (-not (Get-Command git -ErrorAction SilentlyContinue)) { throw "git não encontrado. Instale o git e tente novamente." }
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw "node não encontrado. Instale o Node.js e tente novamente." }

$tmp = Join-Path ([System.IO.Path]::GetTempPath()) ("ccskills-" + [System.Guid]::NewGuid().ToString("N"))

try {
  Write-Host "⬇️  Baixando o repositório de skills..."
  git clone --depth 1 $repo $tmp | Out-Null

  Write-Host "⚙️  Instalando as skills..."
  node (Join-Path $tmp "scripts/install.js") $target
}
finally {
  if (Test-Path $tmp) { Remove-Item -Recurse -Force $tmp -ErrorAction SilentlyContinue }
}
