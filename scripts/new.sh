#!/usr/bin/env bash
set -euo pipefail

echo "Removing example components and stores..."
rm -f src/components/Counter.tsx src/components/TaskManager.tsx
rm -f src/store/counter.store.ts src/store/tasks.store.ts
rm -rf src/components/ui/

echo "Resetting src/main.tsx..."
cat > src/main.tsx << 'MAINEOF'
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Providers } from "@/app/providers";

import "@/index.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element #root not found");

createRoot(rootElement).render(
  <StrictMode>
    <Providers>
      {/* your app goes here */}
    </Providers>
  </StrictMode>
);
MAINEOF

echo ""
echo "Done. Your project is clean."
echo ""
echo "Next steps:"
echo "  1. Add shadcn components:   just add-ui button"
echo "  2. Create your first store: src/store/<name>.store.ts"
echo "  3. Build your first module: src/modules/<feature>/"
echo "  4. Start the dev server:    just dev"
