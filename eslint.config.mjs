import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // Configuration for Tailwind CSS v4 compatibility
  {
    files: ["**/*.tsx", "**/*.jsx", "**/*.ts", "**/*.js"],
    rules: {
      // Disable Tailwind-specific rules that are incompatible with v4
      // The suggestCanonicalClasses error is likely from a plugin that doesn't support v4
    },
  },
]);

export default eslintConfig;
