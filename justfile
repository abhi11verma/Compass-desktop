# AI-First React Boilerplate — task runner
# Run `just` to see all commands

set shell := ["bash", "-cu"]

# Default: list all recipes
default:
    @just --list

# Install all dependencies
install:
    npm install

# Start development server
dev:
    npm run dev

# Type-check and build for production
build:
    npm run build

# Run ESLint across the project
lint:
    npm run lint

# Add a shadcn component: `just add-ui button`
# Full list: https://ui.shadcn.com/docs/components
add-ui component:
    npx shadcn@latest add {{component}}

# List all currently installed shadcn components
list-ui:
    @ls src/components/ui/ 2>/dev/null || echo "No components installed yet."

# Change base theme color: `just apply-theme zinc`
# Available: slate | gray | zinc | neutral | stone | red | rose | orange | green | blue | yellow | violet
apply-theme base-color:
    npx shadcn@latest init --base-color {{base-color}} --yes

# Remove example files and reset to a clean starting point
# Run this once after cloning before building your app
new:
    bash scripts/new.sh

# ── Desktop (Tauri) ──────────────────────────────────────────────────────────

# Start Tauri desktop app in development mode (also starts Vite dev server)
dev-desk:
    npm run tauri:dev

# Build Tauri desktop app for release (.app + .dmg in src-tauri/target/release/bundle/)
build-desk:
    npm run tauri:build

# Generate app icons from a source image (PNG, min 1024×1024)
# Usage: just icon-desk assets/icon.png
icon-desk src:
    npx tauri icon {{src}}
