// eslint.config.js
import pluginNext from "@next/eslint-plugin-next";

export default [
  {
    plugins: {
      "@next/next": pluginNext,
    },
    rules: {
      ...pluginNext.configs["core-web-vitals"].rules,
    },
  },
];
