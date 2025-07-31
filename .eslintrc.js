module.exports = {
  extends: ["next/core-web-vitals"],
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    // Prevent console statements in production
    "no-console": process.env.NODE_ENV === "production" ? "error" : "warn",

    // Allow unused vars with underscore prefix
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],

    // Prevent debugger statements
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "warn",

    // Prevent alert statements in production
    "no-alert": process.env.NODE_ENV === "production" ? "error" : "warn",

    // React specific rules
    "react/no-unescaped-entities": "off",
    "react/display-name": "off",

    // Next.js specific rules
    "@next/next/no-img-element": "off",

    // TypeScript specific rules (commented out - plugin not installed)
    // "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    // "@typescript-eslint/no-explicit-any": "warn",
  },
  overrides: [
    {
      // Allow console statements in development files
      files: ["*.dev.js", "*.dev.ts", "*.dev.tsx", "scripts/**/*"],
      rules: {
        "no-console": "off",
        "no-debugger": "off",
        "no-alert": "off",
      },
    },
  ],
  ignorePatterns: [
    "node_modules/",
    ".next/",
    "out/",
    "dist/",
    "build/",
    "*.config.js",
    "*.config.ts",
  ],
};
