### Automatico
prettier:
agregar archivo .prettierrc a nivel root del proyecto
contenido:
``"@nugget-dev/code-standards/prettier-rules/.prettierrc.json"``

agregar archivo .prettierignore a nivel root del proyecto
contenido:
copy del archivo ``/prettier-rules/.prettierignore``

copiar `/commit-rules/commitlint.config.cjs` a la raiz del proyecto

copiar `/editorconfig-rules/.editorconfig` a la raiz del proyecto

agregar paqueteria commitlint & husky
```
npm install -D husky
npm i -D @commitlint/cli @commitlint/config-conventional
```

agregar keys `husky` & `lint:fix` & `format:write` desde `/npm-rules/npm-rules.json`
```
npx husky init
echo "npm run lint:fix && npm run format:write && git add ." >  .husky/pre-commit
echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg
git add .husky/pre-commit .husky/commit-msg
npm pkg set scripts.lint:fix="eslint src/"*/**/*.{js,ts,jsx,tsx}" --fix"
npm pkg set scripts.format:write="npx prettier --write src/"*/**/*.{js,ts,jsx,tsx}""
```

asi mismo crear el archivo `commitlint.config.js` en la raiz del proyecto
contenido:
```
module.exports = { extends: ['@commitlint/config-conventional'] }
```


### Manual

Agregar el paquete de configuracion eslint a la configuracion del prouyecto
```js
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import { fixupConfigRules } from '@eslint/compat'
import nuggetDev from '@nugget-dev/code-standards' // import nugget dev standards 

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname
})

const eslintConfig = [
    ...nuggetDev.eslintConfig, // add them on top of eslint config, ready for eslint ˆ9
    ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;

```
