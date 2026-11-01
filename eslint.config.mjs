
import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    // Yalnızca src içindeki JavaScript dosyalarını kontrol et
    files: ['src/**/*.js'],

    // ESLint'in önerdiği kuralları kullan
    rules: {
      ...js.configs.recommended.rules,
    },

    languageOptions: {
      // Node.js global değişkenlerini tanı
      globals: globals.node,

      // require() ve module.exports kullandığımız için
      sourceType: 'commonjs',
    },
  },
];
