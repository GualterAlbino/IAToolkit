#!/usr/bin/env bash
# Claude Code status line: RGB gradient, dynamic emoji, cost, code velocity

input=$(cat)

# ── Colors ──
CYAN='\033[36m'
GREEN='\033[32m'
YELLOW='\033[33m'
RED='\033[31m'
MAGENTA='\033[35m'
DIM='\033[2m'
BOLD='\033[1m'
RESET='\033[0m'

# ── Truecolor helper ──
rgb() { printf '\033[38;2;%d;%d;%dm' "$1" "$2" "$3"; }

# ── Parse JSON fields (node, no jq dependency) ──
{
  IFS= read -r model
  IFS= read -r used
  IFS= read -r cost
  IFS= read -r lines_add
  IFS= read -r lines_del
  IFS= read -r cwd
  IFS= read -r tok_in
  IFS= read -r tok_out
} < <(printf '%s' "$input" | node -e '
  const d = JSON.parse(require("fs").readFileSync(0, "utf8"));
  const o = [
    d.model?.display_name ?? "Unknown",
    d.context_window?.used_percentage ?? "",
    d.cost?.total_cost_usd ?? 0,
    d.cost?.total_lines_added ?? 0,
    d.cost?.total_lines_removed ?? 0,
    d.workspace?.current_dir ?? d.cwd ?? "",
    d.context_window?.total_input_tokens ?? 0,
    d.context_window?.total_output_tokens ?? 0,
  ];
  process.stdout.write(o.join("\n"));
')

# ── Git info ──
branch=""
repo=""
if [ -n "$cwd" ]; then
  branch=$(git -C "$cwd" --no-optional-locks symbolic-ref --short HEAD 2>/dev/null)
  repo=$(basename "$(git -C "$cwd" --no-optional-locks rev-parse --show-toplevel 2>/dev/null)" 2>/dev/null)
fi

# ── Context bar: RGB gradient, full blocks only ──
BAR_WIDTH=12

if [ -n "$used" ]; then
  used_int=$(printf '%.0f' "$used")

  # Round to nearest block
  filled=$(( (used_int * BAR_WIDTH + 50) / 100 ))

  bar=""
  for (( i=0; i<BAR_WIDTH; i++ )); do
    pos=$(( i * 100 / (BAR_WIDTH - 1) ))

    if [ "$pos" -le 50 ]; then
      r=$(( 0 + 220 * pos / 50 ))
      g=200
      b=$(( 80 - 80 * pos / 50 ))
    else
      adj=$(( pos - 50 ))
      r=220
      g=$(( 200 - 160 * adj / 50 ))
      b=$(( 0 + 20 * adj / 50 ))
    fi

    if [ "$i" -lt "$filled" ]; then
      bar="${bar}$(rgb $r $g $b)█"
    else
      bar="${bar}\033[38;2;60;60;60m░"
    fi
  done
  bar="${bar}${RESET}"

  if [ "$used_int" -ge 90 ]; then status_emoji="🚨"
  elif [ "$used_int" -ge 70 ]; then status_emoji="🔥"
  elif [ "$used_int" -ge 20 ]; then status_emoji="⚡"
  else status_emoji="🟢"; fi

  if [ "$used_int" -ge 90 ]; then pct_color="$RED"
  elif [ "$used_int" -ge 70 ]; then pct_color="$YELLOW"
  else pct_color="$GREEN"; fi

  ctx_part="${status_emoji} ${bar} ${pct_color}${used_int}%${RESET}"
else
  ctx_part="🟢 \033[38;2;60;60;60m░░░░░░░░░░░░░░░░░░░░${RESET} --%"
fi

# ── Cost ──
cost_part="${YELLOW}$(printf '$%.2f' "$cost")${RESET}"

# ── Tokens ──
human() { awk -v n="$1" 'BEGIN{ if(n>=1000000) printf "%.1fM", n/1000000; else if(n>=1000) printf "%.1fk", n/1000; else printf "%d", n }'; }

tok_total=$(( tok_in + tok_out ))
tokens_part="${CYAN}⬇$(human "$tok_in")${RESET} ${CYAN}⬆$(human "$tok_out")${RESET} ${DIM}=${RESET} ${CYAN}$(human "$tok_total")${RESET}"

# ── Code velocity ──
velocity="${GREEN}+${lines_add}${RESET} ${RED}-${lines_del}${RESET}"

# ── Line 1: repo, branch, velocity, model ──
line1=""
[ -n "$repo" ] && line1="${BOLD}${YELLOW}${repo}${RESET}"
[ -n "$branch" ] && line1="${line1:+$line1 }${BOLD}${CYAN}🌿 (${branch})${RESET}"
line1="${line1:+$line1 ${DIM}|${RESET} }${velocity}"
line1="${line1} ${DIM}|${RESET} ${MAGENTA}🤖 ${model}${RESET}"

# ── Line 2: context, cost, tokens ──
line2="${ctx_part}"
line2="${line2} ${DIM}|${RESET} ${cost_part}"
line2="${line2} ${DIM}|${RESET} ${tokens_part}"

printf '%b\n%b' "$line1" "$line2"
