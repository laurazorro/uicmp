module.exports = {
    extends: [
      "stylelint-config-standard",         // Reglas estándar de Stylelint
      "stylelint-config-tailwindcss",        // Ajustes para Tailwind CSS
         // Desactiva reglas que puedan entrar en conflicto con Prettier
    ],
    plugins: [
      "stylelint-order"                      // Opcional: para ordenar propiedades CSS
    ],
    rules: {
      // Permite los at-rules propios de Tailwind CSS
      "at-rule-no-unknown": [true, {
        ignoreAtRules: [
          "tailwind",
          "apply",
          "variants",
          "responsive",
          "screen"
        ]
      }],
      // Desactiva la validación de patrones en nombres de clases (útil para Tailwind)
      "selector-class-pattern": null
    },
    overrides: [
      {
        // Para estilos embebidos en archivos TSX, JSX, etc.
        files: ["**/*.{tsx,ts,jsx,js}"],
        customSyntax: "postcss-styled-syntax"
      }
    ]
  };
  