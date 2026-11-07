import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import stylistic from "@stylistic/eslint-plugin";

const isDevelopment = process.env.NODE_ENV === "development";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  {
    plugins: {
      "@stylistic": stylistic,
    },
    rules: {
      quotes: ["error", "double", { avoidEscape: true, allowTemplateLiterals: false }],
      "@stylistic/no-mixed-operators": "error",
      "prefer-template": "error",
      "no-implicit-coercion": "error",
      // Moved here so it runs on both local dev and production build/lint pipelines
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  ...(isDevelopment
    ? [
        {
          rules: {
            "@stylistic/max-len": [
              "warn",
              {
                code: 100,
                ignoreUrls: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
              },
            ],
            "no-console": "warn",
            "no-debugger": "warn",
            "react/no-unescaped-entities": "warn",
            "@next/next/no-img-element": "warn",
          },
        },
      ]
    : []),
]);

export default eslintConfig;
